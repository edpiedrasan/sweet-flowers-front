import React from "react";
import {
  Box,
  Grid,
  Text,
  Flex,
  Button,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { FaPowerOff, FaRegLightbulb, FaClock, FaTint, FaWater } from "react-icons/fa";
import { colors, gradients, glassCard } from "../theme/irrigationTheme";

const GpioDashboard = ({ gpioStatus, loading, onToggleGpio, onOpenSchedule, schedules }) => {
  const activeCount = gpioStatus.filter((g) => g[2] === 1).length;

  const getScheduleCount = (gpioId) => {
    if (!schedules) return 0;
    return schedules.filter((s) => s.gpio_id === gpioId && s.enabled).length;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Flex direction="column" align="center" gap={4}>
          <Spinner color={colors.green.glow} size="xl" thickness="3px" speed="0.8s" />
          <Text fontSize="sm" color={colors.text.muted}>Conectando con el sistema...</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Summary strip */}
      <Box
        sx={glassCard}
        p={5}
        mb={6}
        className="glass-card"
      >
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Flex align="center" gap={4}>
            <Box
              w="48px"
              h="48px"
              borderRadius="14px"
              bg={activeCount > 0 ? "rgba(0, 230, 138, 0.15)" : "rgba(100, 116, 139, 0.15)"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon
                as={FaWater}
                color={activeCount > 0 ? colors.green.glow : colors.text.muted}
                boxSize={5}
              />
            </Box>
            <Box>
              <Text fontSize="2xl" fontWeight="800" color={colors.text.primary} lineHeight="1">
                {activeCount}
                <Text as="span" fontSize="sm" fontWeight="400" color={colors.text.muted} ml={2}>
                  / {gpioStatus.length} encendidas
                </Text>
              </Text>
              <Text fontSize="xs" color={colors.text.secondary} mt={1}>
                {schedules ? schedules.filter(s => s.enabled).length : 0} programaciones activas
              </Text>
            </Box>
          </Flex>

          <Flex
            px={4}
            py={2}
            borderRadius="full"
            bg={activeCount > 0 ? "rgba(0, 230, 138, 0.1)" : "rgba(100, 116, 139, 0.1)"}
            border="1px solid"
            borderColor={activeCount > 0 ? colors.border.active : colors.border.subtle}
            align="center"
            gap={2}
          >
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={activeCount > 0 ? colors.green.glow : colors.text.muted}
              className={activeCount > 0 ? "glow-dot" : ""}
            />
            <Text fontSize="xs" fontWeight="600" color={activeCount > 0 ? colors.green.soft : colors.text.muted} letterSpacing="0.05em" textTransform="uppercase">
              {activeCount > 0 ? "Sistema activo" : "Sistema inactivo"}
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* GPIO Cards Grid */}
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
        gap={5}
      >
        {gpioStatus.map((gpio) => {
          const isOn = gpio[2] === 1;
          const gpioId = gpio[0];
          const label = gpio[1];
          const scheduleCount = getScheduleCount(gpioId);

          return (
            <Box
              key={gpioId}
              className={`glass-card ${isOn ? "card-active-breathe" : ""}`}
              bg={isOn ? gradients.cardActive : gradients.card}
              backdropFilter="blur(20px)"
              borderRadius="20px"
              border="1px solid"
              borderColor={isOn ? colors.border.active : colors.border.default}
              p={0}
              overflow="hidden"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                borderColor: isOn ? colors.border.active : colors.border.glow,
                transform: "translateY(-4px)",
                boxShadow: isOn
                  ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 230, 138, 0.08)`
                  : `0 20px 40px rgba(0, 0, 0, 0.3)`,
              }}
            >
              {/* Card top accent bar */}
              <Box
                h="3px"
                bg={isOn ? gradients.greenButton : "transparent"}
                opacity={isOn ? 1 : 0}
                transition="opacity 0.4s ease"
              />

              <Box p={5}>
                {/* Header row */}
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Box>
                    <Text fontSize="xs" color={colors.text.muted} fontWeight="500" letterSpacing="0.08em" textTransform="uppercase" mb={1}>
                      Salida {gpioId}
                    </Text>
                    <Text fontSize="md" color={colors.text.primary} fontWeight="700" lineHeight="1.2">
                      {label}
                    </Text>
                  </Box>
                  <Box
                    w="38px"
                    h="38px"
                    borderRadius="12px"
                    bg={isOn ? "rgba(0, 230, 138, 0.15)" : "rgba(100, 116, 139, 0.1)"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.3s ease"
                  >
                    <Icon
                      as={FaTint}
                      color={isOn ? colors.green.glow : colors.text.dim}
                      boxSize={4}
                    />
                  </Box>
                </Flex>

                {/* Status */}
                <Flex align="center" mb={2}>
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={isOn ? colors.status.on : colors.status.off}
                    mr={2}
                    className={isOn ? "glow-dot" : ""}
                  />
                  <Text
                    fontSize="sm"
                    color={isOn ? colors.green.soft : colors.status.off}
                    fontWeight="600"
                  >
                    {isOn ? "Encendido" : "Apagado"}
                  </Text>
                </Flex>

                {scheduleCount > 0 && (
                  <Flex align="center" mb={4}>
                    <Icon as={FaClock} color={colors.teal.400} boxSize={3} mr={1.5} />
                    <Text fontSize="xs" color={colors.teal.400} fontWeight="500">
                      {scheduleCount} horario{scheduleCount > 1 ? "s" : ""} programado{scheduleCount > 1 ? "s" : ""}
                    </Text>
                  </Flex>
                )}

                {!scheduleCount && <Box mb={4} />}

                {/* Action buttons */}
                <Flex gap={2} direction="column">
                  <Button
                    size="sm"
                    w="100%"
                    h="38px"
                    bg={isOn ? gradients.redButton : gradients.greenButton}
                    color="white"
                    border="none"
                    borderRadius="10px"
                    fontWeight="600"
                    fontSize="xs"
                    letterSpacing="0.02em"
                    _hover={{
                      opacity: 0.9,
                      transform: "scale(1.02)",
                    }}
                    _active={{ transform: "scale(0.98)" }}
                    transition="all 0.2s ease"
                    onClick={() => onToggleGpio(gpioId, isOn ? 0 : 1, label)}
                    leftIcon={isOn ? <FaPowerOff size={12} /> : <FaRegLightbulb size={12} />}
                  >
                    {isOn ? "Apagar" : "Encender"}
                  </Button>
                  <Button
                    size="sm"
                    w="100%"
                    h="36px"
                    bg="transparent"
                    color={colors.text.secondary}
                    border="1px solid"
                    borderColor={colors.border.default}
                    borderRadius="10px"
                    fontWeight="500"
                    fontSize="xs"
                    _hover={{
                      borderColor: colors.teal.400,
                      color: colors.teal.400,
                      bg: "rgba(20, 184, 166, 0.06)",
                    }}
                    transition="all 0.2s ease"
                    onClick={() => onOpenSchedule(gpioId, label)}
                    leftIcon={<FaClock size={11} />}
                  >
                    Programar
                  </Button>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GpioDashboard;
