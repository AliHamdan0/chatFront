import { io } from 'socket.io-client';
import { createContext, useState } from 'react';

export const SocketContext = createContext();
export default function Chatprovider({ children }) {
  const [socket, setSocket] = useState();

  const connect = () => {
    let socketValue = io('https://foggy-flash-cousin.glitch.me');
    socketValue.on('connect', () => {
      console.log('connected Successfully');
      setSocket(socketValue);
      socketValue.emit('initialize');
    });
  };
  const receive = () => {
    socket.on('receive-message', (msg, user) => {
      return { message: msg, user: user };
    });
  };
  ///
  const sendMessage = (msg, room, user) => {
    socket.emit('send-message', msg, room, user, (message) => {});
  };
  const joinRoom = (room, cb = () => '') => {
    socket.emit('join-room', room);
    cb(room);
  };
  return (
    <SocketContext.Provider
      value={[connect, receive, sendMessage, joinRoom, socket]}
    >
      {children}
    </SocketContext.Provider>
  );
}
