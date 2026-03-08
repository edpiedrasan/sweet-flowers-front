import React from "react";
import {
  Box,
  Grid,
  Text,
  Flex,
  Switch,
  Button,
  Spinner,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FaPowerOff, FaRegLightbulb, FaClock } from "react-icons/fa";
import { colors, cardStyle, cardActiveStyle } from "../theme/irrigationTheme";

const GpioDashboard = ({ gpioStatus, loading, onToggleGpio, onOpenSchedule, schedules }) => {
  const activeCount = gpioStatus.filter((g) => g[2] === 1).length;

  const getScheduleCount = (gpioId) => {
    if (!schedules) return 0;
    return schedules.filter((s) => s.gpio_id === gpioId && s.enabled).length;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner color={colors.accent.green} size="xl" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="lg" color={colors.text.primary} fontWeight="600">
            Salidas GPIO
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            {activeCount} de {gpioStatus.length} encendidas
          </Text>
        </Box>
        <Badge
          bg={activeCount > 0 ? colors.accent.green + "20" : colors.bg.card}
          color={activeCount > 0 ? colors.accent.green : colors.text.muted}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
        >
          {activeCount > 0 ? "Activo" : "Inactivo"}
        </Badge>
      </Flex>

      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
        {gpioStatus.map((gpio) => {
          const isOn = gpio[2] === 1;
          const gpioId = gpio[0];
          const label = gpio[1];
          const scheduleCount = getScheduleCount(gpioId);

          return (
            <Box
              key={gpioId}
              sx={isOn ? cardActiveStyle : cardStyle}
              position="relative"
            >
              {isOn && (
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={colors.accent.green}
                  boxShadow={`0 0 8px ${colors.accent.green}`}
                />
              )}

              <Text fontSize="xs" color={colors.text.muted} mb={1}>
                Salida {gpioId}
              </Text>
              <Text fontSize="sm" color={colors.text.primary} fontWeight="600" mb={2} noOfLines={1}>
                {label}
              </Text>

              <Flex align="center" mb={3}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={isOn ? colors.accent.green : colors.accent.red}
                  mr={2}
                />
                <Text fontSize="xs" color={isOn ? colors.accent.green : colors.accent.red} fontWeight="600">
                  {isOn ? "Encendido" : "Apagado"}
                </Text>
              </Flex>

              {scheduleCount > 0 && (
                <Flex align="center" mb={3}>
                  <Icon as={FaClock} color={colors.accent.blue} boxSize={3} mr={1} />
                  <Text fontSize="xs" color={colors.accent.blue}>
                    {scheduleCount} horario{scheduleCount > 1 ? "s" : ""}
                  </Text>
                </Flex>
              )}

              <Flex gap={2} direction="column">
                <Button
                  size="sm"
                  w="100%"
                  bg={isOn ? colors.accent.red : colors.accent.green}
                  color="white"
                  _hover={{ opacity: 0.85 }}
                  onClick={() => onToggleGpio(gpioId, isOn ? 0 : 1, label)}
                  leftIcon={isOn ? <FaPowerOff /> : <FaRegLightbulb />}
                >
                  {isOn ? "Apagar" : "Encender"}
                </Button>
                <Button
                  size="sm"
                  w="100%"
                  variant="outline"
                  borderColor={colors.border.default}
                  color={colors.text.secondary}
                  _hover={{ borderColor: colors.accent.blue, color: colors.accent.blue }}
                  onClick={() => onOpenSchedule(gpioId, label)}
                  leftIcon={<FaClock />}
                >
                  Programar
                </Button>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GpioDashboard;
