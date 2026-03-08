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
  Select,
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
import { FaTint, FaClock, FaLeaf } from "react-icons/fa";
import { colors, gradients } from "../theme/irrigationTheme";

const ScheduleForm = ({ isOpen, onClose, onSave, schedule, gpioId, gpioLabel, gpioOptions }) => {
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

  const handleGpioChange = (e) => {
    const id = parseInt(e.target.value);
    const gpio = gpioOptions ? gpioOptions.find((g) => g[0] === id) : null;
    setForm({ ...form, gpio_id: id, gpio_label: gpio ? gpio[1] : `Salida ${id}` });
  };

  const timeValue = `${String(form.time_hour).padStart(2, "0")}:${String(form.time_minute).padStart(2, "0")}`;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const inputStyle = {
    bg: colors.bg.input,
    border: "1px solid",
    borderColor: colors.border.default,
    borderRadius: "12px",
    color: colors.text.primary,
    fontSize: "lg",
    fontWeight: "600",
    h: "48px",
    _focus: { borderColor: colors.green.soft, boxShadow: `0 0 0 1px ${colors.green.deep}` },
    _hover: { borderColor: colors.border.glow },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
      <ModalOverlay bg={colors.bg.overlay} backdropFilter="blur(16px)" />
      <ModalContent
        bg={colors.bg.secondary}
        borderRadius="24px"
        border="1px solid"
        borderColor={colors.border.default}
        overflow="hidden"
        mx={4}
        boxShadow="0 32px 64px rgba(0,0,0,0.5)"
      >
        <Box h="3px" bg={gradients.header} />

        <ModalHeader pt={6} pb={2} px={6}>
          <Flex align="center" gap={3}>
            <Box
              w="44px"
              h="44px"
              borderRadius="14px"
              bg="rgba(0, 230, 138, 0.1)"
              border="1px solid rgba(0, 230, 138, 0.15)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaLeaf} color={colors.green.glow} boxSize={4} />
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
                {schedule ? "Editar Horario" : "Nuevo Horario"}
              </Text>
              <Text fontSize="xs" color={colors.text.muted} fontWeight="400">
                Configuración de riego automático
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={colors.text.muted} top={5} right={5} _hover={{ color: colors.text.primary }} />

        <ModalBody py={5} px={6}>
          {/* GPIO selector - visible when adding new + gpioOptions available */}
          {!schedule && gpioOptions && gpioOptions.length > 0 && (
            <FormControl mb={5}>
              <FormLabel fontSize="xs" color={colors.text.secondary} fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
                Salida
              </FormLabel>
              <Select
                value={form.gpio_id}
                onChange={handleGpioChange}
                {...inputStyle}
                fontSize="sm"
                icon={<FaTint />}
                iconColor={colors.green.soft}
              >
                {gpioOptions.map((g) => (
                  <option key={g[0]} value={g[0]} style={{ background: colors.bg.secondary, color: colors.text.primary }}>
                    Salida {g[0]} — {g[1]}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {schedule && (
            <Box
              mb={5}
              bg={colors.bg.input}
              border="1px solid"
              borderColor={colors.border.subtle}
              borderRadius="12px"
              px={4}
              py={3}
            >
              <Flex align="center" gap={2}>
                <Icon as={FaTint} color={colors.green.soft} boxSize={3} />
                <Text fontSize="sm" color={colors.text.primary} fontWeight="600">
                  {form.gpio_label}
                </Text>
                <Text fontSize="xs" color={colors.text.muted}>— Salida {form.gpio_id}</Text>
              </Flex>
            </Box>
          )}

          {/* Time */}
          <FormControl mb={5}>
            <FormLabel fontSize="xs" color={colors.text.secondary} fontWeight="600" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
              Hora de riego
            </FormLabel>
            <Flex align="center" gap={3}>
              <Box
                w="40px"
                h="40px"
                borderRadius="10px"
                bg="rgba(52, 211, 153, 0.08)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon as={FaClock} color={colors.green.soft} boxSize={4} />
              </Box>
              <Input type="time" value={timeValue} onChange={handleTimeChange} {...inputStyle} flex={1} />
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
              <NumberInputField {...inputStyle} />
              <NumberInputStepper>
                <NumberIncrementStepper color={colors.text.muted} borderColor={colors.border.default} />
                <NumberDecrementStepper color={colors.text.muted} borderColor={colors.border.default} />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Info banner */}
          <Box
            bg="rgba(0, 230, 138, 0.05)"
            border="1px solid rgba(0, 230, 138, 0.1)"
            borderRadius="12px"
            px={4}
            py={3}
            mb={5}
          >
            <Flex align="center" gap={2}>
              <Box w="6px" h="6px" borderRadius="full" bg={colors.green.soft} flexShrink={0} />
              <Text fontSize="xs" color={colors.green.soft}>
                Se ejecutará todos los días. Recibirás una notificación en Telegram 5 minutos antes con opción de cancelar.
              </Text>
            </Flex>
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
            transition="all 0.2s"
            _hover={{ borderColor: colors.border.glow }}
          >
            <Box>
              <Text fontSize="sm" color={colors.text.primary} fontWeight="500">Habilitado</Text>
              <Text fontSize="xs" color={colors.text.muted}>Activar este horario</Text>
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
            h="46px"
            className="btn-press"
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
            h="46px"
            className="btn-press"
            bg={gradients.greenButton}
            color="white"
            borderRadius="12px"
            fontWeight="700"
            fontSize="sm"
            border="none"
            _hover={{ bg: gradients.greenButtonHover, boxShadow: "0 8px 24px rgba(0, 204, 122, 0.25)" }}
            onClick={handleSave}
          >
            {schedule ? "Guardar cambios" : "Crear horario"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleForm;
