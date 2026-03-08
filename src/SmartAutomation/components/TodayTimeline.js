import React from "react";
import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { colors, gradients, glassCard, gpioColors } from "../theme/irrigationTheme";

const HOURS = Array.from({ length: 25 }, (_, i) => i);

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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="lg" fontWeight="700" color={colors.text.primary}>
            Línea de Tiempo
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {todaySchedules.length} riego{todaySchedules.length !== 1 ? "s" : ""} programado{todaySchedules.length !== 1 ? "s" : ""} hoy
          </Text>
        </Box>
        <Flex
          px={3}
          py={1.5}
          borderRadius="full"
          bg="rgba(0, 230, 138, 0.08)"
          border="1px solid"
          borderColor={colors.border.default}
          align="center"
          gap={2}
        >
          <Icon as={FaClock} color={colors.green.soft} boxSize={3} />
          <Text fontSize="xs" fontWeight="600" color={colors.green.soft}>
            {formatTime(now.getHours(), now.getMinutes())}
          </Text>
        </Flex>
      </Flex>

      {/* Legend */}
      {gpioIds.length > 0 && (
        <Flex gap={3} mb={5} flexWrap="wrap">
          {gpioIds.map((id) => {
            const s = todaySchedules.find((s) => s.gpio_id === id);
            return (
              <Flex
                key={id}
                align="center"
                gap={2}
                bg="rgba(16, 52, 44, 0.4)"
                px={3}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor={colors.border.subtle}
              >
                <Box w="8px" h="8px" borderRadius="full" bg={gpioColorMap[id]} boxShadow={`0 0 6px ${gpioColorMap[id]}40`} />
                <Text fontSize="xs" color={colors.text.secondary} fontWeight="500">
                  {s ? s.gpio_label : `Salida ${id}`}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* Timeline container */}
      <Box
        sx={glassCard}
        p={6}
        className="glass-card"
      >
        <Box position="relative" minW="700px" overflowX="auto">
          {/* Hour labels */}
          <Flex mb={3}>
            {HOURS.filter((h) => h % 3 === 0 && h < 25).map((h) => (
              <Text
                key={h}
                fontSize="xs"
                color={colors.text.dim}
                fontWeight="500"
                w={`${(3 / 24) * 100}%`}
                flexShrink={0}
              >
                {String(h).padStart(2, "0")}:00
              </Text>
            ))}
          </Flex>

          {/* Timeline bar */}
          <Box
            position="relative"
            bg="rgba(10, 30, 25, 0.6)"
            borderRadius="12px"
            h="56px"
            border="1px solid"
            borderColor={colors.border.subtle}
            overflow="hidden"
          >
            {/* Grid lines */}
            {HOURS.filter((h) => h > 0 && h < 24).map((h) => (
              <Box
                key={h}
                position="absolute"
                left={`${(h / 24) * 100}%`}
                top={0}
                bottom={0}
                w="1px"
                bg={h % 6 === 0 ? "rgba(52, 211, 153, 0.08)" : "rgba(52, 211, 153, 0.03)"}
              />
            ))}

            {/* Schedule blocks */}
            {todaySchedules.map((s, idx) => {
              const startMin = s.time_hour * 60 + s.time_minute;
              const left = `${(startMin / (24 * 60)) * 100}%`;
              const width = `${(s.duration_minutes / (24 * 60)) * 100}%`;
              const color = gpioColorMap[s.gpio_id];

              return (
                <Box
                  key={s.id || idx}
                  position="absolute"
                  top="6px"
                  bottom="6px"
                  left={left}
                  width={width}
                  minW="6px"
                  bg={`${color}30`}
                  border="1px solid"
                  borderColor={`${color}50`}
                  borderRadius="8px"
                  cursor="pointer"
                  title={`${s.gpio_label}: ${formatTime(s.time_hour, s.time_minute)} - ${s.duration_minutes}min`}
                  _hover={{
                    bg: `${color}50`,
                    transform: "scaleY(1.08)",
                    zIndex: 5,
                  }}
                  transition="all 0.2s ease"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Text fontSize="9px" color={color} fontWeight="700" whiteSpace="nowrap" px={1}>
                    {formatTime(s.time_hour, s.time_minute)}
                  </Text>
                </Box>
              );
            })}

            {/* Current time line */}
            <Box
              position="absolute"
              left={`${nowPercent}%`}
              top="-2px"
              bottom="-2px"
              w="2px"
              bg={colors.status.off}
              zIndex={10}
              boxShadow={`0 0 8px ${colors.status.off}`}
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
                boxShadow={`0 0 10px ${colors.status.off}`}
              />
            </Box>
          </Box>

          {/* Details below timeline */}
          {todaySchedules.length > 0 && (
            <Flex gap={3} mt={4} flexWrap="wrap">
              {todaySchedules
                .sort((a, b) => a.time_hour * 60 + a.time_minute - (b.time_hour * 60 + b.time_minute))
                .map((s) => {
                  const color = gpioColorMap[s.gpio_id];
                  const startMin = s.time_hour * 60 + s.time_minute;
                  const isPast = startMin + s.duration_minutes < nowMinutes / 1;
                  const isActive = startMin <= nowMinutes && startMin + s.duration_minutes > nowMinutes;

                  return (
                    <Flex
                      key={s.id}
                      align="center"
                      gap={2.5}
                      bg={isActive ? `${color}12` : colors.bg.input}
                      px={3}
                      py={2}
                      borderRadius="10px"
                      border="1px solid"
                      borderColor={isActive ? `${color}40` : colors.border.subtle}
                      opacity={isPast ? 0.5 : 1}
                    >
                      <Box w="6px" h="6px" borderRadius="full" bg={color} boxShadow={isActive ? `0 0 8px ${color}` : "none"} />
                      <Text fontSize="xs" fontWeight="700" color={colors.text.primary}>
                        {formatTime(s.time_hour, s.time_minute)}
                      </Text>
                      <Text fontSize="xs" color={colors.text.muted}>
                        {s.gpio_label}
                      </Text>
                      <Text fontSize="xs" color={colors.text.dim}>
                        {s.duration_minutes}min
                      </Text>
                      {isActive && (
                        <Box
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          bg={`${color}20`}
                        >
                          <Text fontSize="9px" fontWeight="700" color={color} textTransform="uppercase">
                            Activo
                          </Text>
                        </Box>
                      )}
                    </Flex>
                  );
                })}
            </Flex>
          )}
        </Box>

        {todaySchedules.length === 0 && (
          <Flex direction="column" align="center" py={6}>
            <Icon as={FaClock} color={colors.text.dim} boxSize={8} mb={3} />
            <Text color={colors.text.muted} fontSize="sm">No hay riegos programados para hoy</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default TodayTimeline;
