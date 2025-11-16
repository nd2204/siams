import { useEffect, useRef } from "react";
import { createSocket, getSocket, isSocketConnected } from "@/services/realtime/socket-client";
import { useAuth } from "../use-auth";

// Global tracker to prevent duplicate subscriptions across all component instances
const deviceSubscriptionTracker = new Set<string>();

/**
 * Hook to manage device-level socket subscriptions
 * 
 * This hook ensures that only ONE socket emission is sent per device,
 * even if multiple sensors from the same device are being rendered.
 */
export const useDeviceSubscription = (deviceId: string) => {
  const { token } = useAuth();
  const emissionSentRef = useRef(false);

  useEffect(() => {
    if (!token || !deviceId) {
      return;
    }

    // Reset flag when deviceId changes
    emissionSentRef.current = false;

    // Get or create socket
    let socket = getSocket();
    if (!socket) {
      socket = createSocket(token);
    } else if (!isSocketConnected()) {
      socket.connect();
    }

    // Check: have we already emitted joinDevice for this device in THIS session?
    // Only skip if device is subscribed AND socket is actually connected
    if (deviceSubscriptionTracker.has(deviceId) && socket?.connected) {
      console.log("[DeviceSubscription] Device already subscribed:", deviceId);
      return;
    }

    // Check if socket just reconnected - if so, clear the tracker and resubscribe
    const handleReconnect = () => {
      console.log("[DeviceSubscription] Socket reconnected, clearing tracker");
      deviceSubscriptionTracker.clear();
      emissionSentRef.current = false;
    };

    // Check if socket just reconnected - if so, clear the tracker and resubscribe
    const handleDisconnect = () => {
      console.log("[DeviceSubscription] Socket disconnected, clearing tracker");
      deviceSubscriptionTracker.clear();
      emissionSentRef.current = false;
    };

    // Mark that we're about to emit
    emissionSentRef.current = true;
    deviceSubscriptionTracker.add(deviceId);

    console.log("[DeviceSubscription] Subscribing to device:", deviceId, "Socket connected:", socket?.connected);

    // Emit join request for this device
    socket.emit("joinDevice", { deviceId }, (ack: any) => {
      console.log("[DeviceSubscription] Join confirmed for device:", deviceId, ack);
    });

    // Setup handlers for device join confirmation
    const handleJoined = (message: any) => {
      console.log(`[DeviceSubscription] Successfully joined device room:`, message);
    };

    const handleError = (error: any) => {
      console.error("[DeviceSubscription] Socket error:", error);
    };

    socket.on("joinedDevice", handleJoined);
    socket.on("error", handleError);
    socket.on("reconnect", handleReconnect);
    socket.on("disconnect", handleDisconnect)

    // Cleanup: remove handlers when component unmounts
    return () => {
      socket?.off("joinedDevice", handleJoined);
      socket?.off("error", handleError);
      socket?.off("reconnect", handleReconnect);

      // Note: We intentionally don't unsubscribe from the device here
      // because other components might still need the same subscription.
      // In a production app, you'd implement a ref-counting mechanism
      // to properly cleanup when the last subscriber unmounts.
    };
  }, [token, deviceId]);
};
