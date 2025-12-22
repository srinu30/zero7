// File: src/Components/AdminNotifications.jsx

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNotifications } from "../context/NotificationContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AdminNotifications() {
  const audioContextRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      audioUnlockedRef.current = true;
    };

    const playSound = async () => {
      try {
        if (!audioUnlockedRef.current) await unlockAudio();
        const audio = new Audio("/sounds/notification.wav");
        await audio.play();
      } catch (err) {
        console.log("🔔 Sound blocked or file not found:", err);
      }
    };

    const clickUnlock = () => unlockAudio();
    document.addEventListener("click", clickUnlock, { once: true });
    document.addEventListener("touchstart", clickUnlock, { once: true });

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // --- THIS IS THE FIX ---
    // Connect to the base URL of the server, not the /api endpoint
    const socket = io(API_URL.replace("/api", ""));
    // ----------------------
    
    // Listen for the 'newInfoRequest' event emitted from the backend
    socket.on("newInfoRequest", (data) => {
      playSound();

      const newNotification = {
          type: 'info',
          title: 'New Candidate Request',
          message: data.message, // Use the dynamic message from the server
      };
      
      addNotification(newNotification);

      if (Notification.permission === "granted") {
        new Notification("New Candidate Request", {
          body: data.message,
          icon: "/logo192.png",
        });
      }
    });

    // For debugging: Log connection status
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      document.removeEventListener("click", clickUnlock);
      document.removeEventListener("touchstart", clickUnlock);
    };
  }, [addNotification]);

  return null;
}