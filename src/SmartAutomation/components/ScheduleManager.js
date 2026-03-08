import React, { useState, useRef } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus, FaClock, FaTint, FaHourglass, FaCalendarAlt } from "react-icons/fa";
import { colors, gradients, glassCard } from "../theme/irrigationTheme";
import ScheduleForm from "./ScheduleForm";

const ScheduleManager = ({ schedules, onUpdate, onDelete, onToggle, onCreate, gpioStatus }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedGpio, setSelectedGpio] = useState({ id: 0, label: "" });
  const [deleteId, setDeleteId] = useState(null);

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

  const confirmDelete = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const executeDelete = () => {
    if (deleteId) onDelete(deleteId);
    onDeleteClose();
    setDeleteId(null);
  };

  const enabledCount = schedules.filter((s) => s.enabled).length;

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Programación
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {enabledCount} de {schedules.length} activos
          </Text>
        </Box>
        <Button
          size="sm"
          h="40px"
          className="btn-press"
          bg={gradients.greenButton}
          color="white"
          borderRadius="12px"
          fontWeight="600"
          fontSize="xs"
          px={5}
          border="none"
          _hover={{ bg: gradients.greenButtonHover, boxShadow: "0 6px 20px rgba(0,204,122,0.2)" }}
          leftIcon={<FaPlus size={10} />}
          onClick={handleAdd}
        >
          Nuevo horario
        </Button>
      </Flex>

      {/* Empty state */}
      {schedules.length === 0 ? (
        <Box sx={glassCard} py={14} textAlign="center" className="glass-card">
          <Box
            w="64px"
            h="64px"
            borderRadius="20px"
            bg="rgba(100, 116, 139, 0.08)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={4}
          >
            <Icon as={FaCalendarAlt} color={colors.text.dim} boxSize={6} />
          </Box>
          <Text color={colors.text.muted} fontSize="sm" fontWeight="500">
            No hay horarios programados
          </Text>
          <Text color={colors.text.dim} fontSize="xs" mt={1.5} maxW="260px" mx="auto">
            Crea un horario para automatizar el riego de tus salidas GPIO
          </Text>
          <Button
            size="sm"
            mt={5}
            className="btn-press"
            bg={gradients.greenButton}
            color="white"
            borderRadius="10px"
            fontWeight="600"
            fontSize="xs"
            border="none"
            _hover={{ bg: gradients.greenButtonHover }}
            leftIcon={<FaPlus size={10} />}
            onClick={handleAdd}
          >
            Crear primer horario
          </Button>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap={4}>
          {schedules.map((s) => (
            <Box
              key={s.id}
              className="glass-card"
              bg={s.enabled ? gradients.cardActive : gradients.card}
              backdropFilter="blur(20px)"
              borderRadius="20px"
              border="1px solid"
              borderColor={s.enabled ? colors.border.active : colors.border.default}
              overflow="hidden"
              transition="all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                borderColor: colors.border.glow,
                transform: "translateY(-3px)",
                boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
              }}
            >
              <Box h="2px" bg={s.enabled ? gradients.greenButton : "transparent"} opacity={s.enabled ? 0.8 : 0} transition="opacity 0.3s" />

              <Box p={5}>
                {/* Header: label + toggle */}
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Flex align="center" gap={3}>
                    <Box
                      w="38px"
                      h="38px"
                      borderRadius="12px"
                      bg={s.enabled ? "rgba(0, 230, 138, 0.1)" : "rgba(100, 116, 139, 0.08)"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.3s"
                    >
                      <Icon as={FaTint} color={s.enabled ? colors.green.glow : colors.text.dim} boxSize={4} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color={colors.text.primary}>
                        {s.gpio_label}
                      </Text>
                      <Text fontSize="10px" color={colors.text.muted} letterSpacing="0.04em">
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

                {/* Time & Duration pills */}
                <Flex gap={3} mb={4}>
                  <Box
                    flex={1}
                    bg={colors.bg.input}
                    borderRadius="14px"
                    px={3.5}
                    py={3}
                    border="1px solid"
                    borderColor={colors.border.subtle}
                    transition="all 0.2s"
                    _hover={{ borderColor: colors.border.default }}
                  >
                    <Flex align="center" gap={1.5} mb={1}>
                      <Icon as={FaClock} color={colors.green.soft} boxSize={2.5} />
                      <Text fontSize="10px" color={colors.text.muted} fontWeight="500" textTransform="uppercase" letterSpacing="0.05em">Hora</Text>
                    </Flex>
                    <Text fontSize="xl" fontWeight="800" color={colors.text.primary} lineHeight="1">
                      {formatTime(s.time_hour, s.time_minute)}
                    </Text>
                  </Box>
                  <Box
                    flex={1}
                    bg={colors.bg.input}
                    borderRadius="14px"
                    px={3.5}
                    py={3}
                    border="1px solid"
                    borderColor={colors.border.subtle}
                    transition="all 0.2s"
                    _hover={{ borderColor: colors.border.default }}
                  >
                    <Flex align="center" gap={1.5} mb={1}>
                      <Icon as={FaHourglass} color={colors.teal.400} boxSize={2.5} />
                      <Text fontSize="10px" color={colors.text.muted} fontWeight="500" textTransform="uppercase" letterSpacing="0.05em">Duración</Text>
                    </Flex>
                    <Text fontSize="xl" fontWeight="800" color={colors.text.primary} lineHeight="1">
                      {s.duration_minutes}
                      <Text as="span" fontSize="xs" fontWeight="400" color={colors.text.muted} ml={1}>min</Text>
                    </Text>
                  </Box>
                </Flex>

                {/* Footer: info + actions */}
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={1.5}>
                    <Icon as={FaCalendarAlt} color={colors.text.dim} boxSize={2.5} />
                    <Text fontSize="xs" color={colors.text.muted}>Todos los días</Text>
                  </Flex>
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
                      onClick={() => confirmDelete(s.id)}
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

      {/* Schedule form modal */}
      <ScheduleForm
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        schedule={editingSchedule}
        gpioId={selectedGpio.id}
        gpioLabel={selectedGpio.label}
        gpioOptions={gpioStatus}
      />

      {/* Delete confirmation */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay bg={colors.bg.overlay} backdropFilter="blur(8px)" />
        <AlertDialogContent bg={colors.bg.secondary} borderRadius="20px" border="1px solid" borderColor={colors.border.default} mx={4}>
          <AlertDialogHeader fontSize="md" fontWeight="700" color={colors.text.primary} pt={6}>
            Eliminar horario
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text fontSize="sm" color={colors.text.secondary}>
              ¿Estás seguro? Esta acción no se puede deshacer.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter gap={3} pb={6}>
            <Button
              ref={cancelRef}
              onClick={onDeleteClose}
              className="btn-press"
              bg="transparent"
              color={colors.text.secondary}
              border="1px solid"
              borderColor={colors.border.default}
              borderRadius="10px"
              fontSize="sm"
              _hover={{ borderColor: colors.text.muted }}
            >
              Cancelar
            </Button>
            <Button
              className="btn-press"
              bg={gradients.redButton}
              color="white"
              borderRadius="10px"
              fontSize="sm"
              fontWeight="600"
              border="none"
              _hover={{ opacity: 0.9 }}
              onClick={executeDelete}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default ScheduleManager;
