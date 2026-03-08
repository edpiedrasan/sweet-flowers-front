import React, { useState, useEffect } from "react";
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
  Badge,
  Button,
  Select,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { colors, actionBadgeColors } from "../theme/irrigationTheme";
import { getLogs } from "actions/irrigation";

const actionLabels = {
  NOTIFICATION_SENT: "Notificación",
  CANCELLED: "Cancelado",
  STARTED: "Iniciado",
  COMPLETED: "Completado",
  ERROR: "Error",
  MANUAL_ON: "Manual ON",
  MANUAL_OFF: "Manual OFF",
};

const PAGE_SIZE = 20;

const IrrigationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterAction, setFilterAction] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getLogs(100, 0);
      if (res && res.data && res.data.payload) {
        setLogs(res.data.payload);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filterAction
    ? logs.filter((l) => l.action === filterAction)
    : logs;

  const paginatedLogs = filteredLogs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
        <Box>
          <Text fontSize="lg" color={colors.text.primary} fontWeight="600">
            Historial
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {filteredLogs.length} registros
          </Text>
        </Box>
        <Flex gap={2}>
          <Select
            size="sm"
            bg={colors.bg.input}
            color={colors.text.primary}
            borderColor={colors.border.default}
            _focus={{ borderColor: colors.accent.green }}
            w="180px"
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
            placeholder="Todas las acciones"
          >
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key} style={{ background: colors.bg.secondary }}>
                {label}
              </option>
            ))}
          </Select>
          <Button
            size="sm"
            variant="outline"
            borderColor={colors.border.default}
            color={colors.text.secondary}
            _hover={{ borderColor: colors.accent.green }}
            onClick={fetchLogs}
            isLoading={loading}
          >
            Actualizar
          </Button>
        </Flex>
      </Flex>

      <Box
        bg={colors.bg.secondary}
        borderRadius="12px"
        border="1px solid"
        borderColor={colors.border.default}
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Fecha</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Salida</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Acción</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Mensaje</Th>
                <Th color={colors.text.muted} borderColor={colors.border.default}>Cancelado por</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedLogs.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" color={colors.text.muted} borderColor={colors.border.default} py={8}>
                    No hay registros
                  </Td>
                </Tr>
              ) : (
                paginatedLogs.map((log) => {
                  const badgeStyle = actionBadgeColors[log.action] || { bg: colors.bg.card, color: colors.text.muted };
                  return (
                    <Tr key={log.id} _hover={{ bg: colors.bg.card }}>
                      <Td borderColor={colors.border.default}>
                        <Text fontSize="xs" color={colors.text.secondary}>
                          {formatDate(log.executed_at)}
                        </Text>
                      </Td>
                      <Td borderColor={colors.border.default}>
                        <Text fontSize="sm" color={colors.text.primary}>
                          {log.gpio_label || `Salida ${log.gpio_id}`}
                        </Text>
                      </Td>
                      <Td borderColor={colors.border.default}>
                        <Badge
                          px={2}
                          py={0.5}
                          borderRadius="6px"
                          fontSize="xs"
                          bg={badgeStyle.bg}
                          color={badgeStyle.color}
                        >
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </Td>
                      <Td borderColor={colors.border.default}>
                        <Text fontSize="xs" color={colors.text.secondary} maxW="300px" noOfLines={2}>
                          {log.message || "-"}
                        </Text>
                      </Td>
                      <Td borderColor={colors.border.default}>
                        <Text fontSize="xs" color={colors.text.secondary}>
                          {log.cancelled_by || "-"}
                        </Text>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center" align="center" gap={3} py={3} borderTop="1px solid" borderColor={colors.border.default}>
            <Button
              size="xs"
              variant="ghost"
              color={colors.text.secondary}
              isDisabled={page === 0}
              onClick={() => setPage(page - 1)}
              leftIcon={<FaChevronLeft />}
            >
              Anterior
            </Button>
            <Text fontSize="xs" color={colors.text.muted}>
              {page + 1} / {totalPages}
            </Text>
            <Button
              size="xs"
              variant="ghost"
              color={colors.text.secondary}
              isDisabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              rightIcon={<FaChevronRight />}
            >
              Siguiente
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default IrrigationLogs;
