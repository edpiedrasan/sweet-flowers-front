import React from "react";
import { Box, Text, Flex, Icon, Grid } from "@chakra-ui/react";
import { FaClock, FaTint, FaCalendarAlt } from "react-icons/fa";
import { colors, gradients, glassCard, gpioColors } from "../theme/irrigationTheme";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const TodayTimeline = ({ schedules }) => {
  const today = new Date().getDay();

  const todaySchedules = schedules.filter((s) => {
    if (!s.enabled) return false;
    const days = s.active_days.split(",").map(Number);
    return days.includes(today);
  });

  const gpioIds = [...new Set(todaySchedules.map((s) => s.gpio_id))];
  const gpioColorMap = {};
  gpioIds.forEach((id, idx) => {
    gpioColorMap[id] = gpioColors[idx % gpioColors.length];
  });

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowPercent = (nowMinutes / (24 * 60)) * 100;

  const sorted = [...todaySchedules].sort(
    (a, b) => (a.time_hour * 60 + a.time_minute) - (b.time_hour * 60 + b.time_minute)
  );

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Línea de Tiempo
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {todaySchedules.length} riego{todaySchedules.length !== 1 ? "s" : ""} hoy
          </Text>
        </Box>
        <Flex
          px={3}
          py={1.5}
          borderRadius="full"
          bg="rgba(0, 230, 138, 0.06)"
          border="1px solid"
          borderColor={colors.border.default}
          align="center"
          gap={2}
        >
          <Box w="6px" h="6px" borderRadius="full" bg={colors.green.glow} className="glow-dot" />
          <Text fontSize="xs" fontWeight="700" color={colors.green.soft}>
            {formatTime(now.getHours(), now.getMinutes())}
          </Text>
        </Flex>
      </Flex>

      {/* Legend chips */}
      {gpioIds.length > 0 && (
        <Flex gap={2} mb={5} flexWrap="wrap">
          {gpioIds.map((id) => {
            const s = todaySchedules.find((s) => s.gpio_id === id);
            const color = gpioColorMap[id];
            return (
              <Flex
                key={id}
                align="center"
                gap={2}
                bg={`${color}08`}
                px={3}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor={`${color}20`}
              >
                <Box w="8px" h="8px" borderRadius="full" bg={color} boxShadow={`0 0 8px ${color}40`} />
                <Text fontSize="xs" color={colors.text.secondary} fontWeight="500">
                  {s ? s.gpio_label : `Salida ${id}`}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* Timeline card */}
      <Box sx={glassCard} p={{ base: 4, md: 6 }} className="glass-card">
        {todaySchedules.length === 0 ? (
          <Flex direction="column" align="center" py={10}>
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
              <Icon as={FaCalendarAlt} color={colors.text.dim} boxSize={6} />
            </Box>
            <Text color={colors.text.muted} fontSize="sm" fontWeight="500">
              No hay riegos programados para hoy
            </Text>
            <Text color={colors.text.dim} fontSize="xs" mt={1}>
              Crea un horario en la pestaña Programación
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto" css={{ '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(52,211,153,0.15)', borderRadius: '4px' } }}>
            <Box position="relative" minW="700px">
              {/* Hour labels */}
              <Flex mb={2}>
                {HOURS.filter((h) => h % 3 === 0).map((h) => (
                  <Text
                    key={h}
                    fontSize="10px"
                    color={colors.text.dim}
                    fontWeight="500"
                    w={`${(3 / 24) * 100}%`}
                    flexShrink={0}
                    letterSpacing="0.02em"
                  >
                    {String(h).padStart(2, "0")}
                  </Text>
                ))}
              </Flex>

              {/* Timeline bar */}
              <Box
                position="relative"
                bg="rgba(10, 30, 25, 0.5)"
                borderRadius="14px"
                h="60px"
                border="1px solid"
                borderColor={colors.border.subtle}
                overflow="hidden"
              >
                {/* Grid lines */}
                {HOURS.map((h) => (
                  <Box
                    key={h}
                    position="absolute"
                    left={`${(h / 24) * 100}%`}
                    top={0}
                    bottom={0}
                    w="1px"
                    bg={h % 6 === 0 ? "rgba(52, 211, 153, 0.08)" : "rgba(52, 211, 153, 0.025)"}
                  />
                ))}

                {/* Schedule blocks */}
                {sorted.map((s, idx) => {
                  const startMin = s.time_hour * 60 + s.time_minute;
                  const left = `${(startMin / (24 * 60)) * 100}%`;
                  const width = `${Math.max((s.duration_minutes / (24 * 60)) * 100, 0.5)}%`;
                  const color = gpioColorMap[s.gpio_id];
                  const isActive = startMin <= nowMinutes && startMin + s.duration_minutes > nowMinutes;

                  return (
                    <Box
                      key={s.id || idx}
                      position="absolute"
                      top="6px"
                      bottom="6px"
                      left={left}
                      width={width}
                      minW="8px"
                      bg={isActive ? `${color}50` : `${color}25`}
                      border="1px solid"
                      borderColor={isActive ? `${color}70` : `${color}40`}
                      borderRadius="8px"
                      cursor="pointer"
                      title={`${s.gpio_label}: ${formatTime(s.time_hour, s.time_minute)} — ${s.duration_minutes}min`}
                      _hover={{
                        bg: `${color}60`,
                        transform: "scaleY(1.06)",
                        zIndex: 5,
                      }}
                      transition="all 0.2s ease"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                      boxShadow={isActive ? `0 0 12px ${color}30` : "none"}
                    >
                      <Text fontSize="9px" color="white" fontWeight="700" whiteSpace="nowrap" px={1} opacity={0.9}>
                        {formatTime(s.time_hour, s.time_minute)}
                      </Text>
                    </Box>
                  );
                })}

                {/* Current time line */}
                <Box
                  position="absolute"
                  left={`${nowPercent}%`}
                  top="-3px"
                  bottom="-3px"
                  w="2px"
                  bg={colors.status.off}
                  zIndex={10}
                  boxShadow={`0 0 10px ${colors.status.off}80`}
                >
                  <Box
                    className="timeline-now-dot"
                    position="absolute"
                    top="-4px"
                    left="-4px"
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    bg={colors.status.off}
                    border="2px solid rgba(10, 30, 25, 0.8)"
                  />
                </Box>
              </Box>

              {/* Detail cards below */}
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap={2} mt={4}>
                {sorted.map((s) => {
                  const color = gpioColorMap[s.gpio_id];
                  const startMin = s.time_hour * 60 + s.time_minute;
                  const isPast = startMin + s.duration_minutes < nowMinutes;
                  const isActive = startMin <= nowMinutes && startMin + s.duration_minutes > nowMinutes;

                  return (
                    <Flex
                      key={s.id}
                      align="center"
                      gap={2.5}
                      bg={isActive ? `${color}0A` : colors.bg.input}
                      px={3}
                      py={2.5}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor={isActive ? `${color}30` : colors.border.subtle}
                      opacity={isPast ? 0.45 : 1}
                      transition="all 0.25s ease"
                      _hover={{ borderColor: `${color}40` }}
                    >
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={color}
                        flexShrink={0}
                        boxShadow={isActive ? `0 0 10px ${color}` : "none"}
                        className={isActive ? "glow-dot" : ""}
                      />
                      <Box flex={1} minW={0}>
                        <Flex align="center" gap={2}>
                          <Text fontSize="sm" fontWeight="800" color={colors.text.primary} lineHeight="1">
                            {formatTime(s.time_hour, s.time_minute)}
                          </Text>
                          {isActive && (
                            <Box px={1.5} py={0.5} borderRadius="full" bg={`${color}15`}>
                              <Text fontSize="8px" fontWeight="800" color={color} textTransform="uppercase" letterSpacing="0.08em">
                                En curso
                              </Text>
                            </Box>
                          )}
                          {isPast && (
                            <Text fontSize="9px" color={colors.text.dim} fontWeight="500">Completado</Text>
                          )}
                        </Flex>
                        <Text fontSize="xs" color={colors.text.muted} mt={0.5} noOfLines={1}>
                          {s.gpio_label} — {s.duration_minutes} min
                        </Text>
                      </Box>
                    </Flex>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TodayTimeline;
