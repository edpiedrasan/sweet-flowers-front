import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Badge,
  Button,
  Select,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaSync, FaHistory } from "react-icons/fa";
import { colors, gradients, glassCard, actionBadgeColors } from "../theme/irrigationTheme";
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

const PAGE_SIZE = 15;

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
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Historial
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {filteredLogs.length} registros
          </Text>
        </Box>
        <Flex gap={2} align="center">
          <Select
            size="sm"
            bg={colors.bg.input}
            color={colors.text.primary}
            borderColor={colors.border.default}
            borderRadius="10px"
            fontSize="xs"
            h="36px"
            _focus={{ borderColor: colors.green.soft }}
            w="160px"
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
            placeholder="Todas"
          >
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key} style={{ background: colors.bg.secondary }}>
                {label}
              </option>
            ))}
          </Select>
          <Button
            size="sm"
            h="36px"
            bg="transparent"
            color={colors.text.secondary}
            border="1px solid"
            borderColor={colors.border.default}
            borderRadius="10px"
            _hover={{ borderColor: colors.green.soft, color: colors.green.soft }}
            onClick={fetchLogs}
            isLoading={loading}
            px={3}
          >
            <Icon as={FaSync} boxSize={3} />
          </Button>
        </Flex>
      </Flex>

      {/* Log entries */}
      <Box sx={glassCard} overflow="hidden" className="glass-card">
        {loading && logs.length === 0 ? (
          <Flex justify="center" py={10}>
            <Spinner color={colors.green.glow} size="lg" thickness="3px" />
          </Flex>
        ) : paginatedLogs.length === 0 ? (
          <Flex direction="column" align="center" py={10}>
            <Icon as={FaHistory} color={colors.text.dim} boxSize={8} mb={3} />
            <Text color={colors.text.muted} fontSize="sm">No hay registros</Text>
          </Flex>
        ) : (
          <Box>
            {paginatedLogs.map((log, idx) => {
              const badge = actionBadgeColors[log.action] || { bg: colors.bg.card, color: colors.text.muted };
              const isLast = idx === paginatedLogs.length - 1;

              return (
                <Flex
                  key={log.id}
                  px={5}
                  py={3.5}
                  align="center"
                  gap={4}
                  borderBottom={isLast ? "none" : "1px solid"}
                  borderColor={colors.border.subtle}
                  transition="background 0.2s"
                  _hover={{ bg: "rgba(16, 52, 44, 0.3)" }}
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  {/* Colored dot */}
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={badge.color}
                    flexShrink={0}
                    boxShadow={`0 0 6px ${badge.color}40`}
                  />

                  {/* Date */}
                  <Text fontSize="xs" color={colors.text.dim} fontWeight="500" minW="90px" flexShrink={0}>
                    {formatDate(log.executed_at)}
                  </Text>

                  {/* GPIO label */}
                  <Text fontSize="sm" color={colors.text.primary} fontWeight="500" minW="80px" flexShrink={0}>
                    {log.gpio_label || `Salida ${log.gpio_id}`}
                  </Text>

                  {/* Action badge */}
                  <Badge
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="600"
                    bg={badge.bg}
                    color={badge.color}
                    letterSpacing="0.04em"
                    textTransform="uppercase"
                    flexShrink={0}
                  >
                    {actionLabels[log.action] || log.action}
                  </Badge>

                  {/* Message */}
                  <Text fontSize="xs" color={colors.text.muted} flex={1} noOfLines={1}>
                    {log.message || ""}
                  </Text>

                  {/* Cancelled by */}
                  {log.cancelled_by && (
                    <Text fontSize="xs" color={colors.status.off} fontWeight="500" flexShrink={0}>
                      por {log.cancelled_by}
                    </Text>
                  )}
                </Flex>
              );
            })}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex
            justify="center"
            align="center"
            gap={4}
            py={3}
            borderTop="1px solid"
            borderColor={colors.border.subtle}
          >
            <Button
              size="xs"
              variant="ghost"
              color={colors.text.muted}
              isDisabled={page === 0}
              onClick={() => setPage(page - 1)}
              _hover={{ color: colors.green.soft }}
              leftIcon={<FaChevronLeft size={10} />}
            >
              Anterior
            </Button>
            <Flex gap={1}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = page < 3 ? i : page - 2 + i;
                if (pageNum >= totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    size="xs"
                    variant="ghost"
                    w="28px"
                    h="28px"
                    borderRadius="8px"
                    color={pageNum === page ? colors.green.glow : colors.text.dim}
                    bg={pageNum === page ? "rgba(0, 230, 138, 0.1)" : "transparent"}
                    fontWeight={pageNum === page ? "700" : "400"}
                    onClick={() => setPage(pageNum)}
                    _hover={{ bg: "rgba(0, 230, 138, 0.06)" }}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </Flex>
            <Button
              size="xs"
              variant="ghost"
              color={colors.text.muted}
              isDisabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              _hover={{ color: colors.green.soft }}
              rightIcon={<FaChevronRight size={10} />}
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
