import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(pharmacyId) {
  const socketRef = useRef();

  useEffect(() => {
    // Validate pharmacyId
    if (![1, 2, 3].includes(pharmacyId)) {
      console.error('Invalid pharmacyId. Must be 1, 2, or 3');
      return;
    }

    const socketUrl = import.meta.env.VITE_REACT_APP_API_URL;
    
    if (!socketUrl) {
      console.error('Socket server URL not configured in environment variables');
      return;
    }

    // Initialize socket connection
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log(`Connected to socket for pharmacy ${pharmacyId}`);
      socketRef.current.emit('joinPharmacyRoom', pharmacyId);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log(`Disconnected from socket (${reason})`);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    // Cleanup function
    return () => {
      if (socketRef.current?.connected) {
        console.log(`Disconnecting socket for pharmacy ${pharmacyId}`);
        socketRef.current.disconnect();
      }
    };
  }, [pharmacyId]);

  return socketRef.current;
}