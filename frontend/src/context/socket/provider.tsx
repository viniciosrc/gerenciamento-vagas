import { useEffect, useState, type ReactNode } from "react";
import { SocketContext } from "./context";

export type SocketProviderProps = {
  address: string;
  children?: ReactNode;
};

export const SocketProvider = ({ address, children }: SocketProviderProps) => {
  const [socket] = useState<WebSocket>(() => new WebSocket(address));

  useEffect(() => {
    console.log("Connecting WebSocket, provider mounted");

    const handleOnOpen = () => {
      console.log("Socket connected");
      socket.send("Hello, server!");
    };

    const handleOnClose = () => {
      console.log("Socket disconnected");
    };

    /**
     * By default, the server will always send a json as the message payload.
     * So we expect the message to be a json string, otherwise a exception will be thrown.
     */
    socket.addEventListener("open", handleOnOpen);
    socket.addEventListener("close", handleOnClose);

    return () => {
      console.log("Disconnecting WebSocket, provider unmounted");

      socket.removeEventListener("open", handleOnOpen);
      socket.removeEventListener("close", handleOnClose);
      socket.removeEventListener("message", handleOnMessage);

      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
