import { createContext, useContext } from "react";

export type SocketContextType = WebSocket;
export const SocketContext = createContext<SocketContextType>(
  null as unknown as SocketContextType,
);

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("SocketContext is not initialized");
  }

  return socket;
};
