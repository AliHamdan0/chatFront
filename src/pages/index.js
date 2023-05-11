import { io } from 'socket.io-client';
import { useContext, useRef, useState } from 'react';
import { NameModal } from '@/componenets/nameModal';
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import { SideBar } from '@/componenets/sideBar';
import MenuIcon from '@mui/icons-material/Menu';
import { MenuBar } from '@/componenets/menuBar';
import { Sender } from '@/componenets/sender';
import { Receiver } from '@/componenets/receiver';
import SendIcon from '@mui/icons-material/Send';
import { useEffect } from 'react';
import { SocketContext } from '../../utils/chat';
import Head from 'next/head';

export default function Home() {
  const [username, setUsername] = useState({});
  const [open, setOpen] = useState(true); //for modal
  const [openMenu, setOpenMenu] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiveMsg, setReceiveMsg] = useState(
    'Join a room or enter a private chat to start a conversation'
  );
  const [room, setRoom] = useState('');

  const [users, setUsers] = useState([]);
  const [pendingMsgs, setPendingMsgs] = useState([]);

  const [connect, receive, sendMessage, joinRoom, socket] =
    useContext(SocketContext);

  ////
  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (msg, user, inSameRoom) => {
        if (user.id != username.id) {
          if (!inSameRoom) {
            pendingMsgs.push({ id: user.id, msg: msg });
            setPendingMsgs([...pendingMsgs]);
          } else {
            let Msg = { message: msg, username: user.username };
            setReceiveMsg(Msg);
          }
        }
      });
    }
  }, [socket, pendingMsgs]);
  ////
  useEffect(() => {
    setMessages([...messages, receiveMsg]);
  }, [receiveMsg]);
  ////
  ////
  useEffect(() => {
    if (socket) {
      socket.on('users-list', (users) => {
        let index = users.findIndex((user) => user.id == username.id); //remove current user
        users.splice(index, 1);
        setUsers([...users]);
      });
    }
  }, [socket]);
  ////
  const messageEl = useRef(null);
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);
  ////
  const addMessage = () => {
    if (message !== '') {
      let senderMsg = {
        message: message,
        username: username.username,
        sender: true,
      };
      sendMessage(message, room, username);
      messages.push(senderMsg);
      setMessages([...messages]);
      setMessage('');
    }
  };
  const customText = {
    fontWeight: '500',
    letterSpacing: '0.3px',
    fontSize: '16px',
  };
  return (
    <>
      <Head>
        <title>Chat App_Ali@Hamdan</title>
      </Head>
      <NameModal
        open={open}
        setOpen={setOpen}
        setUsername={setUsername}
        username={username}
      />
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ pr: '20%', display: { xs: 'none', md: 'block' } }}>
          <SideBar
            setRoom={setRoom}
            setMessages={setMessages}
            users={users}
            setUsers={setUsers}
            pendingMsgs={pendingMsgs}
            setPendingMsgs={setPendingMsgs}
            username={username}
            room={room}
          />
        </Box>
        <MenuIcon
          sx={{ display: { md: 'none' }, zIndex: 99 }}
          className='iconMenu'
          onClick={() => setOpenMenu(!openMenu)}
        />
        <MenuBar
          open={openMenu}
          setOpen={setOpenMenu}
          setRoom={setRoom}
          setMessages={setMessages}
          users={users}
          setUsers={setUsers}
          pendingMsgs={pendingMsgs}
          setPendingMsgs={setPendingMsgs}
          username={username}
          room={room}
        />
        <Container maxWidth='lg' sx={{ py: 3 }}>
          <Box sx={{ position: 'relative', width: '100%', minHeight: '93vh' }}>
            <Box
              sx={{ maxHeight: '78vh', overflow: 'auto' }}
              className='boxContainer'
              ref={messageEl}
            >
              {messages?.map((msg, index) => (
                <Box key={index}>
                  {typeof msg == 'string' ? (
                    <Box
                      sx={{
                        backgroundColor: '#80808061',
                        mb: '10px',
                        p: '8px',
                      }}
                    >
                      <Typography as='h6' sx={{ fontSize: '18px' }}>
                        {msg}
                      </Typography>
                    </Box>
                  ) : msg?.sender ? (
                    <Sender msg={msg} />
                  ) : (
                    <Receiver msg={msg} />
                  )}
                </Box>
              ))}
            </Box>
            <Box sx={{ pt: '15vh' }}>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '2vh',
                  width: '100%',
                }}
              >
                <TextField
                  id='message-box'
                  placeholder='Write your message here'
                  variant='outlined'
                  inputProps={{ style: customText }} // font size of input text
                  fullWidth
                  multiline
                  disabled={room == ''}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMessage();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SendIcon
                          sx={{
                            fontSize: '40px',
                            color: message == '' ? 'gray' : 'primary.main',
                            cursor: 'pointer',
                          }}
                          onClick={() => addMessage()}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
