import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Switch,
  IconButton,
  Button,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { colors, dayNames } from "../theme/irrigationTheme";
import ScheduleForm from "./ScheduleForm";

const ScheduleManager = ({ schedules, onUpdate, onDelete, onToggle, onCreate, gpioStatus }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const renderDays = (activeDays) => {
    const days = activeDays.split(",").map(Number);
    return dayNames.map((name, idx) => (
      <Badge
        key={idx}
        mx={0.5}
        px={1.5}
        py={0.5}
        borderRadius="4px"
        fontSize="xs"
        bg={days.includes(idx) ? colors.accent.green + "20" : "transparent"}
        color={days.includes(idx) ? colors.accent.green : colors.text.muted}
        border="1px solid"
        borderColor={days.includes(idx) ? colors.accent.green + "40" : colors.border.default}
      >
        {name}
      </Badge>
    ));
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedGpio({ id: schedule.gpio_id, label: schedule.gpio_label });
    onOpen();
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    // Default to first GPIO if available
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

  const tableBg = colors.bg.secondary;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="lg" color={colors.text.primary} fontWeight="600">
            Horarios de Riego
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {schedules.filter((s) => s.enabled).length} horarios activos
          </Text>
        </Box>
        <Button
          size="sm"
          bg={colors.accent.green}
          color="white"
          _hover={{ bg: colors.accent.greenDark }}
          leftIcon={<FaPlus />}
          onClick={handleAdd}
        >
          Agregar
        </Button>
      </Flex>

      <Box
        bg={tableBg}
        borderRadius="12px"
        border="1px solid"
        borderColor={colors.border.default}
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Salida</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Hora</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Duración</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Días</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Estado</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default} textAlign="center">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center" color={colors.text.muted} borderColor={colors.border.default} py={8}>
                    No hay horarios programados
                  </Td>
                </Tr>
              ) : (
                schedules.map((s) => (
                  <Tr key={s.id} _hover={{ bg: colors.bg.card }}>
                    <Td borderColor={colors.border.default}>
                      <Text fontSize="sm" color={colors.text.primary} fontWeight="500">
                        {s.gpio_label}
                      </Text>
                      <Text fontSize="xs" color={colors.text.muted}>
                        Salida {s.gpio_id}
                      </Text>
                    </Td>
                    <Td borderColor={colors.border.default}>
                      <Text fontSize="sm" color={colors.accent.blue} fontWeight="600">
                        {formatTime(s.time_hour, s.time_minute)}
                      </Text>
                    </Td>
                    <Td borderColor={colors.border.default}>
                      <Text fontSize="sm" color={colors.text.primary}>
                        {s.duration_minutes} min
                      </Text>
                    </Td>
                    <Td borderColor={colors.border.default}>
                      <Flex flexWrap="wrap">{renderDays(s.active_days)}</Flex>
                    </Td>
                    <Td borderColor={colors.border.default}>
                      <Switch
                        isChecked={s.enabled === 1}
                        onChange={() => onToggle(s.id, s.enabled === 1 ? 0 : 1)}
                        colorScheme="green"
                        size="sm"
                      />
                    </Td>
                    <Td borderColor={colors.border.default}>
                      <Flex gap={1} justify="center">
                        <IconButton
                          size="xs"
                          variant="ghost"
                          color={colors.accent.blue}
                          _hover={{ bg: colors.accent.blue + "20" }}
                          icon={<FaEdit />}
                          onClick={() => handleEdit(s)}
                          aria-label="Editar"
                        />
                        <IconButton
                          size="xs"
                          variant="ghost"
                          color={colors.accent.red}
                          _hover={{ bg: colors.accent.red + "20" }}
                          icon={<FaTrash />}
                          onClick={() => onDelete(s.id)}
                          aria-label="Eliminar"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

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
