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
  Icon,
} from "@chakra-ui/react";
import { FaTint, FaClock } from "react-icons/fa";
import { colors, gradients } from "../theme/irrigationTheme";

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

  const handleTimeChange = (e) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setForm({ ...form, time_hour: h || 0, time_minute: m || 0 });
  };

  const timeValue = `${String(form.time_hour).padStart(2, "0")}:${String(form.time_minute).padStart(2, "0")}`;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg={colors.bg.overlay} backdropFilter="blur(12px)" />
      <ModalContent
        bg={colors.bg.secondary}
        borderRadius="24px"
        border="1px solid"
        borderColor={colors.border.default}
        overflow="hidden"
        mx={4}
      >
        {/* Top accent */}
        <Box h="3px" bg={gradients.header} />

        <ModalHeader pt={6} pb={2} px={6}>
          <Flex align="center" gap={3}>
            <Box
              w="42px"
              h="42px"
              borderRadius="12px"
              bg="rgba(0, 230, 138, 0.12)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaTint} color={colors.green.glow} boxSize={4} />
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
                {schedule ? "Editar Horario" : "Nuevo Horario"}
              </Text>
              <Text fontSize="xs" color={colors.text.muted} fontWeight="400">
                {form.gpio_label} — Salida {form.gpio_id}
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={colors.text.muted} top={5} right={5} />

        <ModalBody py={6} px={6}>
          {/* Time picker */}
          <FormControl mb={5}>
            <FormLabel fontSize="xs" color={colors.text.secondary} fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Hora de riego
            </FormLabel>
            <Flex align="center" gap={3}>
              <Icon as={FaClock} color={colors.green.soft} boxSize={4} />
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                bg={colors.bg.input}
                border="1px solid"
                borderColor={colors.border.default}
                borderRadius="12px"
                color={colors.text.primary}
                fontSize="lg"
                fontWeight="600"
                h="48px"
                _focus={{
                  borderColor: colors.green.soft,
                  boxShadow: `0 0 0 1px ${colors.green.deep}`,
                }}
                _hover={{ borderColor: colors.border.glow }}
              />
            </Flex>
          </FormControl>

          {/* Duration */}
          <FormControl mb={5}>
            <FormLabel fontSize="xs" color={colors.text.secondary} fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Duración (minutos)
            </FormLabel>
            <NumberInput
              value={form.duration_minutes}
              min={1}
              max={120}
              onChange={(v) => setForm({ ...form, duration_minutes: parseInt(v) || 1 })}
            >
              <NumberInputField
                bg={colors.bg.input}
                border="1px solid"
                borderColor={colors.border.default}
                borderRadius="12px"
                color={colors.text.primary}
                fontSize="lg"
                fontWeight="600"
                h="48px"
                _focus={{
                  borderColor: colors.green.soft,
                  boxShadow: `0 0 0 1px ${colors.green.deep}`,
                }}
                _hover={{ borderColor: colors.border.glow }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper color={colors.text.muted} borderColor={colors.border.default} />
                <NumberDecrementStepper color={colors.text.muted} borderColor={colors.border.default} />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Info: runs every day */}
          <Box
            bg="rgba(0, 230, 138, 0.06)"
            border="1px solid"
            borderColor="rgba(0, 230, 138, 0.12)"
            borderRadius="12px"
            px={4}
            py={3}
            mb={5}
          >
            <Text fontSize="xs" color={colors.green.soft}>
              Este horario se ejecutará todos los días de la semana.
            </Text>
          </Box>

          {/* Enabled toggle */}
          <Flex
            justify="space-between"
            align="center"
            bg={colors.bg.input}
            border="1px solid"
            borderColor={colors.border.default}
            borderRadius="12px"
            px={4}
            py={3}
          >
            <Box>
              <Text fontSize="sm" color={colors.text.primary} fontWeight="500">Habilitado</Text>
              <Text fontSize="xs" color={colors.text.muted}>Activar este horario de riego</Text>
            </Box>
            <Switch
              isChecked={form.enabled === 1}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked ? 1 : 0 })}
              colorScheme="green"
              size="lg"
            />
          </Flex>
        </ModalBody>

        <ModalFooter px={6} pb={6} pt={2} gap={3}>
          <Button
            flex={1}
            h="44px"
            bg="transparent"
            color={colors.text.secondary}
            border="1px solid"
            borderColor={colors.border.default}
            borderRadius="12px"
            fontWeight="500"
            fontSize="sm"
            _hover={{ borderColor: colors.text.muted, color: colors.text.primary }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            flex={1}
            h="44px"
            bg={gradients.greenButton}
            color="white"
            borderRadius="12px"
            fontWeight="600"
            fontSize="sm"
            border="none"
            _hover={{ bg: gradients.greenButtonHover, transform: "scale(1.02)" }}
            _active={{ transform: "scale(0.98)" }}
            onClick={handleSave}
          >
            {schedule ? "Actualizar" : "Crear horario"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleForm;
