import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useToast,
  Icon,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaThLarge,
  FaClock,
  FaChartLine,
  FaHistory,
  FaLeaf,
} from "react-icons/fa";
import { colors, gradients } from "./theme/irrigationTheme";
import GpioDashboard from "./components/GpioDashboard";
import ScheduleManager from "./components/ScheduleManager";
import ScheduleForm from "./components/ScheduleForm";
import TodayTimeline from "./components/TodayTimeline";
import IrrigationLogs from "./components/IrrigationLogs";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
  getGpioStatus,
  toggleGpio,
} from "actions/irrigation";

import "./Irrigation.css";

const tabItems = [
  { label: "Dashboard", icon: FaThLarge },
  { label: "Programación", icon: FaClock },
  { label: "Timeline", icon: FaChartLine },
  { label: "Historial", icon: FaHistory },
];

const REFRESH_INTERVAL = 15000; // 15s auto-refresh

export const IndexSmartAutomation = () => {
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const refreshRef = useRef(null);

  const [gpioStatus, setGpioStatus] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });
  const [tabIndex, setTabIndex] = useState(0);

  const fetchGpioStatus = useCallback(async (silent = false) => {
    try {
      const res = await getGpioStatus();
      if (res && res.data && res.data.payload) {
        setGpioStatus(res.data.payload);
      } else {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) setGpioStatus(await response.json());
      }
    } catch (error) {
      try {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) setGpioStatus(await response.json());
      } catch (err) {
        if (!silent) console.error("Error fetching GPIO:", err);
      }
    }
    if (!silent) setLoading(false);
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await getSchedules();
      if (res && res.data && res.data.payload) {
        setSchedules(res.data.payload);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGpioStatus();
    fetchSchedules();
  }, [fetchGpioStatus, fetchSchedules]);

  // Auto-refresh GPIO every 15s
  useEffect(() => {
    refreshRef.current = setInterval(() => {
      fetchGpioStatus(true);
    }, REFRESH_INTERVAL);
    return () => clearInterval(refreshRef.current);
  }, [fetchGpioStatus]);

  const showToast = (title, desc, status) => {
    toast({
      title,
      description: desc,
      status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
      variant: "subtle",
    });
  };

  const handleToggleGpio = async (gpioId, turn, label) => {
    try {
      setTogglingId(gpioId);
      await toggleGpio(gpioId, turn, label);
      await fetchGpioStatus();
      showToast(
        turn === 1 ? "Encendido" : "Apagado",
        `${label} (Salida ${gpioId})`,
        turn === 1 ? "success" : "info"
      );
    } catch (error) {
      showToast("Error", "No se pudo cambiar el estado", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenSchedule = (gpioId, label) => {
    setSelectedGpio({ id: gpioId, label });
    setTabIndex(1);
  };

  const handleCreateSchedule = async (data) => {
    try {
      await createSchedule(data);
      await fetchSchedules();
      showToast("Horario creado", `${data.gpio_label} a las ${String(data.time_hour).padStart(2,"0")}:${String(data.time_minute).padStart(2,"0")}`, "success");
    } catch (error) {
      showToast("Error", "No se pudo crear el horario", "error");
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    try {
      await updateSchedule(id, data);
      await fetchSchedules();
      showToast("Actualizado", "Horario modificado con éxito", "success");
    } catch (error) {
      showToast("Error", "No se pudo actualizar", "error");
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      showToast("Eliminado", "Horario removido", "info");
    } catch (error) {
      showToast("Error", "No se pudo eliminar", "error");
    }
  };

  const handleToggleSchedule = async (id, enabled) => {
    try {
      await toggleSchedule(id, enabled);
      await fetchSchedules();
    } catch (error) {
      showToast("Error", "No se pudo cambiar estado", "error");
    }
  };

  // Find next upcoming irrigation
  const getNextIrrigation = () => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = now.getDay();
    const enabled = schedules.filter((s) => {
      if (!s.enabled) return false;
      const days = s.active_days.split(",").map(Number);
      return days.includes(today);
    });
    const upcoming = enabled
      .filter((s) => s.time_hour * 60 + s.time_minute > nowMin)
      .sort((a, b) => (a.time_hour * 60 + a.time_minute) - (b.time_hour * 60 + b.time_minute));
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const nextIrrigation = getNextIrrigation();

  return (
    <Box className="irrigation-root" px={{ base: 3, md: 6, lg: 8 }} py={{ base: 4, md: 6 }} position="relative" zIndex={1}>

      {/* ---- Header ---- */}
      <Flex
        justify="space-between"
        align="center"
        mb={{ base: 5, md: 7 }}
        maxW="1280px"
        mx="auto"
      >
        <Flex align="center" gap={{ base: 3, md: 4 }}>
          <Box
            w={{ base: "44px", md: "52px" }}
            h={{ base: "44px", md: "52px" }}
            borderRadius="16px"
            bg="rgba(0, 230, 138, 0.1)"
            border="1px solid rgba(0, 230, 138, 0.2)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            flexShrink={0}
          >
            <Icon as={FaLeaf} color={colors.green.glow} boxSize={{ base: 4, md: 5 }} />
            <Box
              position="absolute"
              inset="-6px"
              borderRadius="22px"
              boxShadow="0 0 25px rgba(0, 230, 138, 0.12)"
              pointerEvents="none"
            />
          </Box>
          <Box>
            <Text className="gradient-title" fontSize={{ base: "lg", md: "2xl" }} lineHeight="1.1">
              Control de Riego
            </Text>
            <Flex gap={3} mt={1} flexWrap="wrap">
              <Flex align="center" gap={1.5}>
                <Box w="6px" h="6px" borderRadius="full" bg={gpioStatus.filter((g) => g[2] === 1).length > 0 ? colors.green.glow : colors.text.dim} className={gpioStatus.filter((g) => g[2] === 1).length > 0 ? "glow-dot" : ""} />
                <Text fontSize="xs" color={colors.text.secondary}>
                  {gpioStatus.filter((g) => g[2] === 1).length} activas
                </Text>
              </Flex>
              <Text fontSize="xs" color={colors.text.dim}>|</Text>
              <Flex align="center" gap={1.5}>
                <Icon as={FaClock} color={colors.text.dim} boxSize={2.5} />
                <Text fontSize="xs" color={colors.text.secondary}>
                  {schedules.filter((s) => s.enabled).length} horarios
                </Text>
              </Flex>
              {nextIrrigation && (
                <>
                  <Text fontSize="xs" color={colors.text.dim}>|</Text>
                  <Text fontSize="xs" color={colors.green.soft}>
                    Próximo: {String(nextIrrigation.time_hour).padStart(2, "0")}:{String(nextIrrigation.time_minute).padStart(2, "0")}
                  </Text>
                </>
              )}
            </Flex>
          </Box>
        </Flex>

        <Button
          size="sm"
          h="38px"
          className="btn-press"
          bg="rgba(16, 52, 44, 0.4)"
          backdropFilter="blur(10px)"
          color={colors.text.secondary}
          border="1px solid"
          borderColor={colors.border.default}
          borderRadius="12px"
          fontWeight="500"
          fontSize="xs"
          _hover={{
            borderColor: colors.border.glow,
            color: colors.text.primary,
            bg: "rgba(16, 52, 44, 0.6)",
          }}
          leftIcon={<FaArrowLeft size={10} />}
          onClick={() => history.goBack()}
        >
          Volver
        </Button>
      </Flex>

      {/* ---- Content ---- */}
      <Box maxW="1280px" mx="auto">
        <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isLazy>
          {/* Tab bar */}
          <TabList
            bg="rgba(16, 52, 44, 0.3)"
            backdropFilter="blur(24px)"
            borderRadius="16px"
            border="1px solid"
            borderColor={colors.border.default}
            p={1.5}
            mb={{ base: 5, md: 7 }}
            gap={1}
            overflowX="auto"
            css={{ '&::-webkit-scrollbar': { display: 'none' } }}
          >
            {tabItems.map((tab, idx) => (
              <Tab
                key={idx}
                flex={1}
                minW="auto"
                py={2.5}
                px={{ base: 3, md: 4 }}
                borderRadius="12px"
                fontSize="xs"
                fontWeight="500"
                color={colors.text.muted}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _selected={{
                  bg: gradients.tabActive,
                  color: colors.green.glow,
                  fontWeight: "700",
                  boxShadow: "0 0 20px rgba(0, 230, 138, 0.05)",
                  borderColor: "transparent",
                }}
                _hover={{
                  color: tabIndex === idx ? colors.green.glow : colors.text.secondary,
                  bg: tabIndex === idx ? undefined : "rgba(16, 52, 44, 0.2)",
                }}
                _focus={{ boxShadow: "none" }}
              >
                <Flex align="center" gap={2} justify="center">
                  <Icon as={tab.icon} boxSize={3.5} />
                  <Text display={{ base: "none", sm: "block" }} whiteSpace="nowrap">{tab.label}</Text>
                </Flex>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0} className="tab-panel-animated">
              <GpioDashboard
                gpioStatus={gpioStatus}
                loading={loading}
                togglingId={togglingId}
                onToggleGpio={handleToggleGpio}
                onOpenSchedule={handleOpenSchedule}
                schedules={schedules}
                nextIrrigation={nextIrrigation}
              />
            </TabPanel>

            <TabPanel p={0} className="tab-panel-animated">
              <ScheduleManager
                schedules={schedules}
                onUpdate={handleUpdateSchedule}
                onDelete={handleDeleteSchedule}
                onToggle={handleToggleSchedule}
                onCreate={handleCreateSchedule}
                gpioStatus={gpioStatus}
              />
            </TabPanel>

            <TabPanel p={0} className="tab-panel-animated">
              <TodayTimeline schedules={schedules} />
            </TabPanel>

            <TabPanel p={0} className="tab-panel-animated">
              <IrrigationLogs />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <ScheduleForm
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleCreateSchedule}
        schedule={null}
        gpioId={selectedGpio.id}
        gpioLabel={selectedGpio.label}
        gpioOptions={gpioStatus}
      />
    </Box>
  );
};
