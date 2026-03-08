import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { colors } from "../theme/irrigationTheme";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIMELINE_HEIGHT = 50;

const gpioColors = [
  colors.accent.green,
  colors.accent.blue,
  colors.accent.orange,
  colors.accent.purple,
  colors.accent.cyan,
  colors.accent.red,
];

const TodayTimeline = ({ schedules }) => {
  const today = new Date().getDay();

  const todaySchedules = schedules.filter((s) => {
    if (!s.enabled) return false;
    const days = s.active_days.split(",").map(Number);
    return days.includes(today);
  });

  // Assign colors to GPIO IDs
  const gpioIds = [...new Set(todaySchedules.map((s) => s.gpio_id))];
  const gpioColorMap = {};
  gpioIds.forEach((id, idx) => {
    gpioColorMap[id] = gpioColors[idx % gpioColors.length];
  });

  const getBlockStyle = (schedule) => {
    const startMinutes = schedule.time_hour * 60 + schedule.time_minute;
    const totalMinutes = 24 * 60;
    const left = `${(startMinutes / totalMinutes) * 100}%`;
    const width = `${(schedule.duration_minutes / totalMinutes) * 100}%`;
    return { left, width };
  };

  const formatTime = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const nowPercent = (nowMinutes / (24 * 60)) * 100;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="lg" color={colors.text.primary} fontWeight="600">
            Línea de Tiempo - Hoy
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {todaySchedules.length} riego{todaySchedules.length !== 1 ? "s" : ""} programado{todaySchedules.length !== 1 ? "s" : ""}
          </Text>
        </Box>
      </Flex>

      {/* Legend */}
      <Flex gap={4} mb={4} flexWrap="wrap">
        {gpioIds.map((id) => {
          const schedule = todaySchedules.find((s) => s.gpio_id === id);
          return (
            <Flex key={id} align="center" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg={gpioColorMap[id]} />
              <Text fontSize="xs" color={colors.text.secondary}>
                {schedule ? schedule.gpio_label : `Salida ${id}`}
              </Text>
            </Flex>
          );
        })}
      </Flex>

      {/* Timeline */}
      <Box
        bg={colors.bg.secondary}
        borderRadius="12px"
        border="1px solid"
        borderColor={colors.border.default}
        p={4}
        overflowX="auto"
      >
        <Box position="relative" minW="800px">
          {/* Hour markers */}
          <Flex justify="space-between" mb={2}>
            {HOURS.filter((h) => h % 2 === 0).map((h) => (
              <Text key={h} fontSize="xs" color={colors.text.muted} w="8.33%">
                {String(h).padStart(2, "0")}:00
              </Text>
            ))}
          </Flex>

          {/* Timeline bar */}
          <Box
            position="relative"
            bg={colors.bg.input}
            borderRadius="8px"
            h={`${TIMELINE_HEIGHT}px`}
            border="1px solid"
            borderColor={colors.border.default}
          >
            {/* Hour grid lines */}
            {HOURS.map((h) => (
              <Box
                key={h}
                position="absolute"
                left={`${(h / 24) * 100}%`}
                top={0}
                bottom={0}
                w="1px"
                bg={colors.border.default}
                opacity={0.5}
              />
            ))}

            {/* Schedule blocks */}
            {todaySchedules.map((s, idx) => {
              const { left, width } = getBlockStyle(s);
              return (
                <Box
                  key={s.id || idx}
                  position="absolute"
                  top="4px"
                  bottom="4px"
                  left={left}
                  width={width}
                  minW="4px"
                  bg={gpioColorMap[s.gpio_id]}
                  opacity={0.8}
                  borderRadius="4px"
                  cursor="pointer"
                  title={`${s.gpio_label}: ${formatTime(s.time_hour, s.time_minute)} - ${s.duration_minutes}min`}
                  _hover={{ opacity: 1, transform: "scaleY(1.1)" }}
                  transition="all 0.2s"
                />
              );
            })}

            {/* Current time indicator */}
            <Box
              position="absolute"
              left={`${nowPercent}%`}
              top="-4px"
              bottom="-4px"
              w="2px"
              bg={colors.accent.red}
              zIndex={2}
            >
              <Box
                position="absolute"
                top="-6px"
                left="-3px"
                w={2}
                h={2}
                borderRadius="full"
                bg={colors.accent.red}
              />
            </Box>
          </Box>

          {/* Schedule details below timeline */}
          {todaySchedules.length > 0 && (
            <Flex gap={3} mt={3} flexWrap="wrap">
              {todaySchedules.map((s) => (
                <Flex
                  key={s.id}
                  align="center"
                  gap={2}
                  bg={colors.bg.card}
                  px={3}
                  py={1.5}
                  borderRadius="8px"
                  border="1px solid"
                  borderColor={colors.border.default}
                >
                  <Box w={2} h={2} borderRadius="full" bg={gpioColorMap[s.gpio_id]} />
                  <Text fontSize="xs" color={colors.text.primary} fontWeight="500">
                    {formatTime(s.time_hour, s.time_minute)}
                  </Text>
                  <Text fontSize="xs" color={colors.text.muted}>
                    {s.gpio_label} · {s.duration_minutes}min
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TodayTimeline;
