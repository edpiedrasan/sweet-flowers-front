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
import { FaChevronLeft, FaChevronRight, FaSync, FaHistory, FaInbox } from "react-icons/fa";
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

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return "Ayer";
  return d.toLocaleDateString("es-CR", { day: "2-digit", month: "short" });
};

const IrrigationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
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

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Historial
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {filteredLogs.length} registro{filteredLogs.length !== 1 ? "s" : ""}
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
            placeholder="Todas las acciones"
          >
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key} style={{ background: colors.bg.secondary, color: colors.text.primary }}>
                {label}
              </option>
            ))}
          </Select>
          <Button
            size="sm"
            h="36px"
            w="36px"
            p={0}
            className="btn-press"
            bg="transparent"
            color={colors.text.secondary}
            border="1px solid"
            borderColor={colors.border.default}
            borderRadius="10px"
            _hover={{ borderColor: colors.green.soft, color: colors.green.soft }}
            onClick={fetchLogs}
            isLoading={loading}
          >
            <Icon as={FaSync} boxSize={3} />
          </Button>
        </Flex>
      </Flex>

      {/* Log list */}
      <Box sx={glassCard} overflow="hidden" className="glass-card">
        {loading && logs.length === 0 ? (
          <Flex justify="center" align="center" py={14} direction="column" gap={3}>
            <Spinner color={colors.green.glow} size="lg" thickness="3px" speed="0.8s" />
            <Text fontSize="xs" color={colors.text.muted}>Cargando historial...</Text>
          </Flex>
        ) : paginatedLogs.length === 0 ? (
          <Flex direction="column" align="center" py={14}>
            <Box
              w="60px"
              h="60px"
              borderRadius="18px"
              bg="rgba(100, 116, 139, 0.06)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <Icon as={FaInbox} color={colors.text.dim} boxSize={6} />
            </Box>
            <Text color={colors.text.muted} fontSize="sm" fontWeight="500">Sin registros</Text>
            <Text color={colors.text.dim} fontSize="xs" mt={1}>
              {filterAction ? "Prueba cambiando el filtro" : "Los eventos de riego aparecerán aquí"}
            </Text>
          </Flex>
        ) : (
          <Box>
            {paginatedLogs.map((log, idx) => {
              const badge = actionBadgeColors[log.action] || { bg: "rgba(100,116,139,0.1)", color: colors.text.muted };
              const isLast = idx === paginatedLogs.length - 1;

              return (
                <Flex
                  key={log.id}
                  px={{ base: 4, md: 5 }}
                  py={3.5}
                  align="center"
                  gap={{ base: 3, md: 4 }}
                  borderBottom={isLast ? "none" : "1px solid"}
                  borderColor={colors.border.subtle}
                  transition="background 0.2s ease"
                  _hover={{ bg: "rgba(16, 52, 44, 0.25)" }}
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  {/* Color dot */}
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={badge.color}
                    flexShrink={0}
                    boxShadow={`0 0 6px ${badge.color}30`}
                  />

                  {/* Time ago */}
                  <Text fontSize="xs" color={colors.text.dim} fontWeight="500" minW={{ base: "auto", md: "80px" }} flexShrink={0}>
                    {timeAgo(log.executed_at)}
                  </Text>

                  {/* GPIO */}
                  <Text fontSize="sm" color={colors.text.primary} fontWeight="500" minW={{ base: "auto", md: "90px" }} flexShrink={0}>
                    {log.gpio_label || `Salida ${log.gpio_id}`}
                  </Text>

                  {/* Action badge */}
                  <Badge
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="700"
                    bg={badge.bg}
                    color={badge.color}
                    letterSpacing="0.04em"
                    textTransform="uppercase"
                    flexShrink={0}
                  >
                    {actionLabels[log.action] || log.action}
                  </Badge>

                  {/* Message */}
                  <Text fontSize="xs" color={colors.text.muted} flex={1} noOfLines={1} display={{ base: "none", lg: "block" }}>
                    {log.message || ""}
                  </Text>

                  {/* Cancelled by */}
                  {log.cancelled_by && (
                    <Text fontSize="xs" color={colors.status.off} fontWeight="500" flexShrink={0}>
                      {log.cancelled_by}
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
            gap={3}
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
              borderRadius="8px"
            >
              <Icon as={FaChevronLeft} boxSize={2.5} />
            </Button>
            <Flex gap={0.5}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = page < 3 ? i : Math.min(page - 2 + i, totalPages - 1);
                if (i > 0 && pageNum === parseInt(Array.from({ length: i }, (_, j) => page < 3 ? j : Math.min(page - 2 + j, totalPages - 1)).pop())) return null;
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
                    fontWeight={pageNum === page ? "700" : "500"}
                    fontSize="xs"
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
              borderRadius="8px"
            >
              <Icon as={FaChevronRight} boxSize={2.5} />
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default IrrigationLogs;
