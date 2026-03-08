import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Switch,
  IconButton,
  Button,
  Icon,
  Grid,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus, FaClock, FaTint, FaHourglass } from "react-icons/fa";
import { colors, gradients, glassCard } from "../theme/irrigationTheme";
import ScheduleForm from "./ScheduleForm";

const ScheduleManager = ({ schedules, onUpdate, onDelete, onToggle, onCreate, gpioStatus }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedGpio({ id: schedule.gpio_id, label: schedule.gpio_label });
    onOpen();
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    if (gpioStatus && gpioStatus.length > 0) {
      setSelectedGpio({ id: gpioStatus[0][0], label: gpioStatus[0][1] });
    }
    onOpen();
  };

  const handleSave = (formData) => {
    if (editingSchedule) {
      onUpdate(editingSchedule.id, formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Programación
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {schedules.filter((s) => s.enabled).length} de {schedules.length} horarios activos
          </Text>
        </Box>
        <Button
          size="sm"
          h="38px"
          bg={gradients.greenButton}
          color="white"
          borderRadius="10px"
          fontWeight="600"
          fontSize="xs"
          border="none"
          _hover={{ bg: gradients.greenButtonHover, transform: "scale(1.02)" }}
          _active={{ transform: "scale(0.98)" }}
          leftIcon={<FaPlus size={10} />}
          onClick={handleAdd}
        >
          Nuevo horario
        </Button>
      </Flex>

      {/* Schedule Cards */}
      {schedules.length === 0 ? (
        <Box sx={glassCard} p={10} textAlign="center">
          <Icon as={FaClock} color={colors.text.dim} boxSize={10} mb={4} />
          <Text color={colors.text.muted} fontSize="sm">
            No hay horarios programados
          </Text>
          <Text color={colors.text.dim} fontSize="xs" mt={1}>
            Presiona "Nuevo horario" para crear uno
          </Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap={4}>
          {schedules.map((s) => (
            <Box
              key={s.id}
              className="glass-card"
              bg={s.enabled ? gradients.cardActive : gradients.card}
              backdropFilter="blur(20px)"
              borderRadius="18px"
              border="1px solid"
              borderColor={s.enabled ? colors.border.active : colors.border.default}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{
                borderColor: colors.border.glow,
                transform: "translateY(-2px)",
                boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
              }}
            >
              {/* Top accent */}
              <Box h="2px" bg={s.enabled ? gradients.greenButton : "transparent"} opacity={s.enabled ? 0.7 : 0} />

              <Box p={5}>
                {/* Row 1: label + toggle */}
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Flex align="center" gap={3}>
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="10px"
                      bg={s.enabled ? "rgba(0, 230, 138, 0.12)" : "rgba(100, 116, 139, 0.1)"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaTint} color={s.enabled ? colors.green.glow : colors.text.dim} boxSize={3.5} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color={colors.text.primary}>
                        {s.gpio_label}
                      </Text>
                      <Text fontSize="xs" color={colors.text.muted}>
                        Salida {s.gpio_id}
                      </Text>
                    </Box>
                  </Flex>
                  <Switch
                    isChecked={s.enabled === 1}
                    onChange={() => onToggle(s.id, s.enabled === 1 ? 0 : 1)}
                    colorScheme="green"
                    size="sm"
                  />
                </Flex>

                {/* Row 2: Time & Duration */}
                <Flex gap={4} mb={4}>
                  <Box
                    flex={1}
                    bg={colors.bg.input}
                    borderRadius="12px"
                    px={3}
                    py={2.5}
                    border="1px solid"
                    borderColor={colors.border.subtle}
                  >
                    <Flex align="center" gap={2}>
                      <Icon as={FaClock} color={colors.green.soft} boxSize={3} />
                      <Text fontSize="xs" color={colors.text.muted}>Hora</Text>
                    </Flex>
                    <Text fontSize="xl" fontWeight="800" color={colors.text.primary} mt={1}>
                      {formatTime(s.time_hour, s.time_minute)}
                    </Text>
                  </Box>
                  <Box
                    flex={1}
                    bg={colors.bg.input}
                    borderRadius="12px"
                    px={3}
                    py={2.5}
                    border="1px solid"
                    borderColor={colors.border.subtle}
                  >
                    <Flex align="center" gap={2}>
                      <Icon as={FaHourglass} color={colors.teal.400} boxSize={3} />
                      <Text fontSize="xs" color={colors.text.muted}>Duración</Text>
                    </Flex>
                    <Text fontSize="xl" fontWeight="800" color={colors.text.primary} mt={1}>
                      {s.duration_minutes}
                      <Text as="span" fontSize="xs" fontWeight="400" color={colors.text.muted} ml={1}>min</Text>
                    </Text>
                  </Box>
                </Flex>

                {/* Row 3: info + actions */}
                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" color={colors.text.muted}>
                    Todos los días
                  </Text>
                  <Flex gap={1}>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      color={colors.teal.400}
                      _hover={{ bg: "rgba(20, 184, 166, 0.1)" }}
                      icon={<FaEdit />}
                      onClick={() => handleEdit(s)}
                      aria-label="Editar"
                      borderRadius="8px"
                    />
                    <IconButton
                      size="xs"
                      variant="ghost"
                      color={colors.status.off}
                      _hover={{ bg: "rgba(239, 68, 68, 0.1)" }}
                      icon={<FaTrash />}
                      onClick={() => onDelete(s.id)}
                      aria-label="Eliminar"
                      borderRadius="8px"
                    />
                  </Flex>
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      <ScheduleForm
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        schedule={editingSchedule}
        gpioId={selectedGpio.id}
        gpioLabel={selectedGpio.label}
      />
    </Box>
  );
};

export default ScheduleManager;
