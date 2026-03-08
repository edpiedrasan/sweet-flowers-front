import React from "react";
import {
  Box,
  Grid,
  Text,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaPowerOff, FaRegLightbulb, FaClock, FaTint, FaWater, FaBell } from "react-icons/fa";
import { colors, gradients, glassCard } from "../theme/irrigationTheme";

const teal400 = colors.teal["400"];

/* Skeleton placeholder while loading */
const SkeletonCard = () => (
  <Box
    borderRadius="20px"
    border="1px solid"
    borderColor={colors.border.subtle}
    overflow="hidden"
    bg={gradients.card}
  >
    <Box h="3px" />
    <Box p={5}>
      <Flex justify="space-between" mb={4}>
        <Box>
          <Box className="skeleton-box" w="60px" h="10px" mb={2} />
          <Box className="skeleton-box" w="100px" h="16px" />
        </Box>
        <Box className="skeleton-box" w="38px" h="38px" borderRadius="12px" />
      </Flex>
      <Box className="skeleton-box" w="80px" h="12px" mb={4} />
      <Box className="skeleton-box" w="100%" h="38px" borderRadius="10px" mb={2} />
      <Box className="skeleton-box" w="100%" h="36px" borderRadius="10px" />
    </Box>
  </Box>
);

const GpioDashboard = ({ gpioStatus, loading, togglingId, onToggleGpio, onOpenSchedule, schedules, nextIrrigation }) => {
  const activeCount = gpioStatus.filter((g) => g[2] === 1).length;

  const getScheduleCount = (gpioId) => {
    if (!schedules) return 0;
    return schedules.filter((s) => s.gpio_id === gpioId && s.enabled).length;
  };

  return (
    <Box>
      {/* ---- Summary Row ---- */}
      <Grid templateColumns={{ base: "1fr", md: nextIrrigation ? "1fr 1fr" : "1fr" }} gap={4} mb={6}>
        {/* Status card */}
        <Box sx={glassCard} p={5} className="glass-card">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={4}>
              <Box
                w="48px"
                h="48px"
                borderRadius="14px"
                bg={activeCount > 0 ? "rgba(0, 230, 138, 0.12)" : "rgba(100, 116, 139, 0.1)"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon
                  as={FaWater}
                  color={activeCount > 0 ? colors.green.glow : colors.text.muted}
                  boxSize={5}
                />
              </Box>
              <Box>
                <Text fontSize="2xl" fontWeight="800" color={colors.text.primary} lineHeight="1">
                  {loading ? "-" : activeCount}
                  <Text as="span" fontSize="sm" fontWeight="400" color={colors.text.muted} ml={2}>
                    / {loading ? "-" : gpioStatus.length} encendidas
                  </Text>
                </Text>
                <Text fontSize="xs" color={colors.text.secondary} mt={1}>
                  {schedules ? schedules.filter(s => s.enabled).length : 0} programaciones activas
                </Text>
              </Box>
            </Flex>

            <Flex
              px={3}
              py={1.5}
              borderRadius="full"
              bg={activeCount > 0 ? "rgba(0, 230, 138, 0.08)" : "rgba(100, 116, 139, 0.08)"}
              border="1px solid"
              borderColor={activeCount > 0 ? colors.border.active : colors.border.subtle}
              align="center"
              gap={2}
              display={{ base: "none", sm: "flex" }}
            >
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg={activeCount > 0 ? colors.green.glow : colors.text.muted}
                className={activeCount > 0 ? "glow-dot" : ""}
              />
              <Text fontSize="10px" fontWeight="700" color={activeCount > 0 ? colors.green.soft : colors.text.muted} letterSpacing="0.06em" textTransform="uppercase">
                {activeCount > 0 ? "Activo" : "Inactivo"}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Next irrigation card */}
        {nextIrrigation && (
          <Box sx={glassCard} p={5} className="glass-card" borderColor="rgba(20, 184, 166, 0.15)">
            <Flex align="center" gap={4}>
              <Box
                w="48px"
                h="48px"
                borderRadius="14px"
                bg="rgba(20, 184, 166, 0.1)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon as={FaBell} color={teal400} boxSize={5} />
              </Box>
              <Box flex={1}>
                <Text fontSize="xs" color={colors.text.muted} fontWeight="500" textTransform="uppercase" letterSpacing="0.06em">
                  Próximo riego
                </Text>
                <Text fontSize="2xl" fontWeight="800" color={colors.text.primary} lineHeight="1" mt={0.5}>
                  {String(nextIrrigation.time_hour).padStart(2, "0")}:{String(nextIrrigation.time_minute).padStart(2, "0")}
                </Text>
                <Text fontSize="xs" color={teal400} mt={0.5}>
                  {nextIrrigation.gpio_label} — {nextIrrigation.duration_minutes} min
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
      </Grid>

      {/* ---- GPIO Cards ---- */}
      {loading ? (
        <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={5}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </Grid>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
          gap={5}
        >
          {gpioStatus.map((gpio) => {
            const isOn = gpio[2] === 1;
            const gpioId = gpio[0];
            const label = gpio[1];
            const scheduleCount = getScheduleCount(gpioId);
            const isToggling = togglingId === gpioId;

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
                    ? "0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(0,230,138,0.08)"
                    : "0 20px 40px rgba(0,0,0,0.25)",
                }}
              >
                {/* Top accent bar */}
                <Box
                  h="3px"
                  bg={isOn ? gradients.greenButton : "transparent"}
                  opacity={isOn ? 1 : 0}
                  transition="opacity 0.4s ease"
                />

                <Box p={5}>
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <Box>
                      <Text fontSize="10px" color={colors.text.muted} fontWeight="600" letterSpacing="0.1em" textTransform="uppercase" mb={1}>
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
                      bg={isOn ? "rgba(0, 230, 138, 0.12)" : "rgba(100, 116, 139, 0.08)"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.3s ease"
                    >
                      <Icon as={FaTint} color={isOn ? colors.green.glow : colors.text.dim} boxSize={4} />
                    </Box>
                  </Flex>

                  {/* Status indicator */}
                  <Flex align="center" mb={3}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={isOn ? colors.status.on : colors.status.off}
                      mr={2}
                      className={isOn ? "glow-dot" : ""}
                    />
                    <Text fontSize="sm" color={isOn ? colors.green.soft : colors.status.off} fontWeight="600">
                      {isOn ? "Encendido" : "Apagado"}
                    </Text>
                  </Flex>

                  {scheduleCount > 0 && (
                    <Flex align="center" mb={4}>
                      <Icon as={FaClock} color={teal400} boxSize={3} mr={1.5} />
                      <Text fontSize="xs" color={teal400} fontWeight="500">
                        {scheduleCount} horario{scheduleCount > 1 ? "s" : ""}
                      </Text>
                    </Flex>
                  )}
                  {!scheduleCount && <Box mb={4} />}

                  {/* Buttons */}
                  <Flex gap={2} direction="column">
                    <Button
                      size="sm"
                      w="100%"
                      h="40px"
                      className="btn-press"
                      bg={isOn ? gradients.redButton : gradients.greenButton}
                      color="white"
                      border="none"
                      borderRadius="12px"
                      fontWeight="600"
                      fontSize="xs"
                      letterSpacing="0.02em"
                      isLoading={isToggling}
                      loadingText={isOn ? "Apagando..." : "Encendiendo..."}
                      _hover={{ opacity: 0.9, transform: "scale(1.02)" }}
                      transition="all 0.2s ease"
                      onClick={() => onToggleGpio(gpioId, isOn ? 0 : 1, label)}
                      leftIcon={!isToggling ? (isOn ? <FaPowerOff size={12} /> : <FaRegLightbulb size={12} />) : undefined}
                    >
                      {isOn ? "Apagar" : "Encender"}
                    </Button>
                    <Button
                      size="sm"
                      w="100%"
                      h="38px"
                      className="btn-press"
                      bg="transparent"
                      color={colors.text.secondary}
                      border="1px solid"
                      borderColor={colors.border.default}
                      borderRadius="12px"
                      fontWeight="500"
                      fontSize="xs"
                      _hover={{
                        borderColor: teal400,
                        color: teal400,
                        bg: "rgba(20, 184, 166, 0.05)",
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
      )}
    </Box>
  );
};

export default GpioDashboard;
