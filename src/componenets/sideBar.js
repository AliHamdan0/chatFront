import { Typography, Box } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../../utils/chat';

export const SideBar = ({
  setRoom,
  setMessages,
  users,
  pendingMsgs,
  setPendingMsgs,
  setUsers,
  username,
  room,
}) => {
  const [connect, receive, sendMessage, joinRoom] = useContext(SocketContext);
  const iconStyle = {
    color: '#001685',
    px: 1,
    fontSize: '35px',
  };
  const roomsList = [
    { id: 1, name: 'Technology', icon: <ComputerIcon sx={iconStyle} /> },
    { id: 2, name: 'Sport', icon: <SportsVolleyballIcon sx={iconStyle} /> },
    { id: 3, name: 'History', icon: <HistoryToggleOffIcon sx={iconStyle} /> },
    {
      id: 4,
      name: 'Social',
      icon: <ConnectWithoutContactIcon sx={iconStyle} />,
    },
  ];

  const chatUser = (id, socket, name) => {
    joinRoom(socket, () => setMessages([`Start a private chat with ${name}`]));
    setRoom(socket);
    // setMessages([`Private chat with ${name}`]);
    if (pendingMsgs.length > 0) {
      let unReadMsgs = pendingMsgs
        .filter((ms) => ms.id == id)
        .map((m) => {
          return {
            username: name,
            message: m.msg,
          };
        });
      setMessages([`Start a private chat with ${name}`, ...unReadMsgs]);
      let newPending = [];
      for (let k = 0; k < pendingMsgs.length; k++)
        if (pendingMsgs[k].id !== id) newPending.push(pendingMsgs[k]);
      setPendingMsgs([...newPending]);
    }
  };
  useEffect(() => {
    const hasPendingMsg = () => {
      for (let i = 0; i < users.length; i++) {
        let msgForUser = pendingMsgs?.filter((item) => item.id == users[i].id);
        users[i].numOfMsg = msgForUser.length;
      }
      setUsers([...users]);
    };
    hasPendingMsg();
  }, [pendingMsgs]);
  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        color: '#fff',
        width: '20%',
        py: 3,
        borderRight: '2px solid black',
        height: '100vh',
        position: 'fixed',
        left: '0px',
        top: '0px',
      }}
    >
      <Typography
        as='h6'
        sx={{ fontSize: '20px', fontWeight: 600, color: 'grey', mb: 3, px: 3 }}
      >
        Welcome {username.username}
      </Typography>
      <Typography
        as='h6'
        sx={{ fontSize: '24px', fontWeight: 700, color: 'black', mb: 1, px: 3 }}
      >
        Rooms
      </Typography>
      {roomsList?.map((item) => (
        <Box
          key={item.id}
          sx={{
            cursor: 'pointer',
            py: '1px',
            px: 2,
            '&:hover': { backgroundColor: '#77777717' },
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            joinRoom(item.id, () =>
              setMessages([`Joined the ${item.name} Room`])
            );
            setRoom(item.id);
          }}
        >
          {item.icon}
          <Typography as='p' sx={{ fontSize: '18px', my: 1, color: '#001685' }}>
            {item.name}
          </Typography>
        </Box>
      ))}
      <Typography
        as='h6'
        sx={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'black',
          mb: 1,
          mt: 2,
          px: 3,
        }}
      >
        Private Chat
      </Typography>

      {users?.length > 0 ? (
        users?.map((item) => (
          <Box
            key={item?.id}
            sx={{
              cursor: 'pointer',
              py: '1px',
              px: 3,
              '&:hover': { backgroundColor: '#77777717' },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => chatUser(item?.id, item?.socket, item.username)}
          >
            <Typography
              as='p'
              sx={{ fontSize: '18px', my: 1, color: '#001a27' }}
            >
              {item?.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {item?.numOfMsg > 0 && (
                <Box
                  sx={{
                    p: '2px',
                    width: '25px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    height: '25px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography as='p' sx={{ fontSize: '14px', color: '#fff' }}>
                    {item?.numOfMsg}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  p: '3px',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  height: '3px',
                  width: '3px',
                }}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Typography
          as='p'
          sx={{ fontSize: '18px', mb: 1, color: '#001685', px: 3 }}
        >
          ---
        </Typography>
      )}
    </Box>
  );
};
