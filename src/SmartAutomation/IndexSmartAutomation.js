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
} from "@chakra-ui/react";
import { FaArrowLeft, FaTint } from "react-icons/fa";
import { colors } from "./theme/irrigationTheme";
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
      // Try API proxy first, fallback to direct
      const res = await getGpioStatus();
      if (res && res.data && res.data.payload) {
        setGpioStatus(res.data.payload);
      } else {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) {
          const data = await response.json();
          setGpioStatus(data);
        }
      }
    } catch (error) {
      // Fallback to direct Dataplicity call
      try {
        const response = await fetch("https://polemic-quetzal-1242.dataplicity.io/gpio");
        if (response.ok) {
          const data = await response.json();
          setGpioStatus(data);
        }
      } catch (err) {
        console.error("Error fetching GPIO status:", err);
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

  const handleToggleGpio = async (gpioId, turn, label) => {
    try {
      setLoading(true);
      await toggleGpio(gpioId, turn, label);
      await fetchGpioStatus();
      toast({
        title: turn === 1 ? "Encendido" : "Apagado",
        description: `${label} (Salida ${gpioId}) ${turn === 1 ? "encendido" : "apagado"}`,
        status: turn === 1 ? "success" : "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del GPIO",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      setLoading(false);
    }
  };

  const handleOpenSchedule = (gpioId, label) => {
    setSelectedGpio({ id: gpioId, label });
    setTabIndex(1); // Switch to Schedule tab
  };

  const handleCreateSchedule = async (data) => {
    try {
      await createSchedule(data);
      await fetchSchedules();
      toast({
        title: "Horario creado",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({ title: "Error al crear horario", status: "error", duration: 3000, isClosable: true, position: "bottom-right" });
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    try {
      await updateSchedule(id, data);
      await fetchSchedules();
      toast({
        title: "Horario actualizado",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({ title: "Error al actualizar horario", status: "error", duration: 3000, isClosable: true, position: "bottom-right" });
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      toast({
        title: "Horario eliminado",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({ title: "Error al eliminar horario", status: "error", duration: 3000, isClosable: true, position: "bottom-right" });
    }
  };

  const handleToggleSchedule = async (id, enabled) => {
    try {
      await toggleSchedule(id, enabled);
      await fetchSchedules();
    } catch (error) {
      toast({ title: "Error al cambiar estado", status: "error", duration: 3000, isClosable: true, position: "bottom-right" });
    }
  };

  const tabStyle = {
    color: colors.text.muted,
    fontSize: "sm",
    fontWeight: "500",
    _selected: {
      color: colors.accent.green,
      borderBottomColor: colors.accent.green,
      borderBottomWidth: "2px",
    },
    _hover: {
      color: colors.text.primary,
    },
  };

  return (
    <Box bg={colors.bg.primary} minH="100vh" p={{ base: 3, md: 6 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} maxW="1200px" mx="auto">
        <Flex align="center" gap={3}>
          <Box
            p={2}
            borderRadius="10px"
            bg={colors.accent.green + "15"}
          >
            <FaTint color={colors.accent.green} size={20} />
          </Box>
          <Box>
            <Text className="gradient-title" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              Control de Riego
            </Text>
            <Text fontSize="xs" color={colors.text.secondary}>
              {gpioStatus.filter((g) => g[2] === 1).length} señales activas · {schedules.filter((s) => s.enabled).length} horarios
            </Text>
          </Box>
        </Flex>
        <Button
          size="sm"
          variant="outline"
          borderColor={colors.border.default}
          color={colors.text.secondary}
          _hover={{ borderColor: colors.text.secondary, color: colors.text.primary }}
          leftIcon={<FaArrowLeft />}
          onClick={() => history.goBack()}
        >
          Volver
        </Button>
      </Flex>

      {/* Tabs */}
      <Box maxW="1200px" mx="auto">
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant="unstyled"
          isLazy
        >
          <TabList
            bg={colors.bg.secondary}
            borderRadius="12px"
            border="1px solid"
            borderColor={colors.border.default}
            p={1}
            mb={6}
            gap={1}
          >
            <Tab {...tabStyle} borderRadius="8px" _selected={{ ...tabStyle._selected, bg: colors.bg.card }}>
              Dashboard
            </Tab>
            <Tab {...tabStyle} borderRadius="8px" _selected={{ ...tabStyle._selected, bg: colors.bg.card }}>
              Programación
            </Tab>
            <Tab {...tabStyle} borderRadius="8px" _selected={{ ...tabStyle._selected, bg: colors.bg.card }}>
              Línea de Tiempo
            </Tab>
            <Tab {...tabStyle} borderRadius="8px" _selected={{ ...tabStyle._selected, bg: colors.bg.card }}>
              Historial
            </Tab>
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

      {/* Quick schedule form from Dashboard */}
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
