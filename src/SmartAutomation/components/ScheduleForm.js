import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Box,
  Text,
  Switch,
} from "@chakra-ui/react";
import { colors, dayNames, dayValues } from "../theme/irrigationTheme";

const ScheduleForm = ({ isOpen, onClose, onSave, schedule, gpioId, gpioLabel }) => {
  const [form, setForm] = useState({
    gpio_id: gpioId || 0,
    gpio_label: gpioLabel || "",
    time_hour: 6,
    time_minute: 0,
    duration_minutes: 5,
    active_days: "0,1,2,3,4,5,6",
    enabled: 1,
  });

  useEffect(() => {
    if (schedule) {
      setForm({
        gpio_id: schedule.gpio_id,
        gpio_label: schedule.gpio_label,
        time_hour: schedule.time_hour,
        time_minute: schedule.time_minute,
        duration_minutes: schedule.duration_minutes,
        active_days: schedule.active_days,
        enabled: schedule.enabled,
      });
    } else {
      setForm({
        gpio_id: gpioId || 0,
        gpio_label: gpioLabel || "",
        time_hour: 6,
        time_minute: 0,
        duration_minutes: 5,
        active_days: "0,1,2,3,4,5,6",
        enabled: 1,
      });
    }
  }, [schedule, gpioId, gpioLabel, isOpen]);

  const activeDaysArray = form.active_days ? form.active_days.split(",").map(Number) : [];

  const toggleDay = (day) => {
    let newDays;
    if (activeDaysArray.includes(day)) {
      newDays = activeDaysArray.filter((d) => d !== day);
    } else {
      newDays = [...activeDaysArray, day].sort();
    }
    setForm({ ...form, active_days: newDays.join(",") });
  };

  const handleTimeChange = (e) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setForm({ ...form, time_hour: h || 0, time_minute: m || 0 });
  };

  const timeValue = `${String(form.time_hour).padStart(2, "0")}:${String(form.time_minute).padStart(2, "0")}`;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const modalBg = colors.bg.secondary;
  const inputBg = colors.bg.input;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg={modalBg} color={colors.text.primary} borderRadius="12px" border="1px solid" borderColor={colors.border.default}>
        <ModalHeader borderBottom="1px solid" borderColor={colors.border.default}>
          {schedule ? "Editar Horario" : "Nuevo Horario"}
          <Text fontSize="sm" color={colors.text.secondary} fontWeight="normal">
            {form.gpio_label} (Salida {form.gpio_id})
          </Text>
        </ModalHeader>
        <ModalCloseButton color={colors.text.secondary} />

        <ModalBody py={5}>
          <FormControl mb={4}>
            <FormLabel fontSize="sm" color={colors.text.secondary}>Hora de Riego</FormLabel>
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              bg={inputBg}
              border="1px solid"
              borderColor={colors.border.default}
              color={colors.text.primary}
              _focus={{ borderColor: colors.accent.green }}
              size="lg"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontSize="sm" color={colors.text.secondary}>Duración (minutos)</FormLabel>
            <NumberInput
              value={form.duration_minutes}
              min={1}
              max={120}
              onChange={(v) => setForm({ ...form, duration_minutes: parseInt(v) || 1 })}
            >
              <NumberInputField
                bg={inputBg}
                border="1px solid"
                borderColor={colors.border.default}
                color={colors.text.primary}
                _focus={{ borderColor: colors.accent.green }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper color={colors.text.secondary} borderColor={colors.border.default} />
                <NumberDecrementStepper color={colors.text.secondary} borderColor={colors.border.default} />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontSize="sm" color={colors.text.secondary}>Días Activos</FormLabel>
            <Flex gap={2} flexWrap="wrap">
              {dayValues.map((day, idx) => (
                <Box
                  key={day}
                  as="button"
                  px={3}
                  py={2}
                  borderRadius="8px"
                  fontSize="sm"
                  fontWeight="600"
                  bg={activeDaysArray.includes(day) ? colors.accent.green : colors.bg.input}
                  color={activeDaysArray.includes(day) ? "white" : colors.text.secondary}
                  border="1px solid"
                  borderColor={activeDaysArray.includes(day) ? colors.accent.green : colors.border.default}
                  onClick={() => toggleDay(day)}
                  _hover={{ opacity: 0.8 }}
                  transition="all 0.2s"
                >
                  {dayNames[idx]}
                </Box>
              ))}
            </Flex>
          </FormControl>

          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel fontSize="sm" color={colors.text.secondary} mb={0}>Habilitado</FormLabel>
              <Switch
                isChecked={form.enabled === 1}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked ? 1 : 0 })}
                colorScheme="green"
                size="lg"
              />
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor={colors.border.default} gap={3}>
          <Button
            variant="outline"
            borderColor={colors.border.default}
            color={colors.text.secondary}
            _hover={{ borderColor: colors.text.secondary }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            bg={colors.accent.green}
            color="white"
            _hover={{ bg: colors.accent.greenDark }}
            onClick={handleSave}
          >
            {schedule ? "Actualizar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleForm;
