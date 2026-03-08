import React, { useState, useEffect, useCallback } from "react";
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
  FaTint,
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

export const IndexSmartAutomation = () => {
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gpioStatus, setGpioStatus] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });
  const [tabIndex, setTabIndex] = useState(0);

  const fetchGpioStatus = useCallback(async () => {
    try {
      const res = await getGpioStatus();
      if (res && res.data && res.data.payload) {
        setGpioStatus(res.data.payload);
      } else {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) {
          setGpioStatus(await response.json());
        }
      }
    } catch (error) {
      try {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) setGpioStatus(await response.json());
      } catch (err) {
        console.error("Error fetching GPIO:", err);
      }
    }
    setLoading(false);
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

  useEffect(() => {
    fetchGpioStatus();
    fetchSchedules();
  }, [fetchGpioStatus, fetchSchedules]);

  const showToast = (title, desc, status) => {
    toast({
      title,
      description: desc,
      status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleToggleGpio = async (gpioId, turn, label) => {
    try {
      setLoading(true);
      await toggleGpio(gpioId, turn, label);
      await fetchGpioStatus();
      showToast(
        turn === 1 ? "Encendido" : "Apagado",
        `${label} (Salida ${gpioId})`,
        turn === 1 ? "success" : "info"
      );
    } catch (error) {
      showToast("Error", "No se pudo cambiar el estado", "error");
      setLoading(false);
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
      showToast("Horario creado", "", "success");
    } catch (error) {
      showToast("Error", "No se pudo crear el horario", "error");
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    try {
      await updateSchedule(id, data);
      await fetchSchedules();
      showToast("Horario actualizado", "", "success");
    } catch (error) {
      showToast("Error", "No se pudo actualizar", "error");
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      showToast("Horario eliminado", "", "info");
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

  return (
    <Box className="irrigation-root" px={{ base: 4, md: 6, lg: 8 }} py={6} position="relative" zIndex={1}>
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        maxW="1280px"
        mx="auto"
      >
        <Flex align="center" gap={4}>
          {/* Icon with glow */}
          <Box
            w="52px"
            h="52px"
            borderRadius="16px"
            bg="rgba(0, 230, 138, 0.1)"
            border="1px solid"
            borderColor="rgba(0, 230, 138, 0.2)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Icon as={FaLeaf} color={colors.green.glow} boxSize={5} />
            <Box
              position="absolute"
              inset="-4px"
              borderRadius="20px"
              bg="transparent"
              boxShadow="0 0 20px rgba(0, 230, 138, 0.1)"
              pointerEvents="none"
            />
          </Box>
          <Box>
            <Text className="gradient-title" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.1">
              Control de Riego
            </Text>
            <Flex gap={3} mt={1.5}>
              <Flex align="center" gap={1.5}>
                <Box w="6px" h="6px" borderRadius="full" bg={colors.green.glow} className="glow-dot" />
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
            </Flex>
          </Box>
        </Flex>

        <Button
          size="sm"
          h="38px"
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

      {/* Content */}
      <Box maxW="1280px" mx="auto">
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant="unstyled"
          isLazy
        >
          {/* Tab bar */}
          <TabList
            bg="rgba(16, 52, 44, 0.35)"
            backdropFilter="blur(20px)"
            borderRadius="16px"
            border="1px solid"
            borderColor={colors.border.default}
            p={1.5}
            mb={8}
            gap={1}
          >
            {tabItems.map((tab, idx) => (
              <Tab
                key={idx}
                flex={1}
                py={2.5}
                borderRadius="12px"
                fontSize="xs"
                fontWeight="500"
                color={colors.text.muted}
                transition="all 0.3s ease"
                _selected={{
                  bg: gradients.tabActive,
                  color: colors.green.glow,
                  fontWeight: "700",
                  boxShadow: "0 0 20px rgba(0, 230, 138, 0.05)",
                }}
                _hover={{
                  color: tabIndex === idx ? colors.green.glow : colors.text.secondary,
                }}
              >
                <Flex align="center" gap={2} justify="center">
                  <Icon as={tab.icon} boxSize={3.5} />
                  <Text display={{ base: "none", sm: "block" }}>{tab.label}</Text>
                </Flex>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <GpioDashboard
                gpioStatus={gpioStatus}
                loading={loading}
                onToggleGpio={handleToggleGpio}
                onOpenSchedule={handleOpenSchedule}
                schedules={schedules}
              />
            </TabPanel>

            <TabPanel p={0}>
              <ScheduleManager
                schedules={schedules}
                onUpdate={handleUpdateSchedule}
                onDelete={handleDeleteSchedule}
                onToggle={handleToggleSchedule}
                onCreate={handleCreateSchedule}
                gpioStatus={gpioStatus}
              />
            </TabPanel>

            <TabPanel p={0}>
              <TodayTimeline schedules={schedules} />
            </TabPanel>

            <TabPanel p={0}>
              <IrrigationLogs />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Quick schedule modal from Dashboard */}
      <ScheduleForm
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleCreateSchedule}
        schedule={null}
        gpioId={selectedGpio.id}
        gpioLabel={selectedGpio.label}
      />
    </Box>
  );
};
