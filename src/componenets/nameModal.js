import Modal from '@mui/material/Modal';
import {
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { addUser } from '../../utils/apiConfig';
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { SocketContext } from '../../utils/chat';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const customText = {
  fontWeight: '600',
  letterSpacing: '0.3px',
  fontSize: '19px',
  textAlign: 'center',
};

export function NameModal({ open, setOpen, setUsername }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [connect] = useContext(SocketContext);
  const sendUser = async () => {
    setLoading(true);
    const res = await axios.post(
      addUser,
      { username: name },
      { 'Access-Control-Allow-Origin': '*' }
    );
    if (res.status == 200) {
      setOpen(false);
      connect();
      setUsername(res.data);
    }
    setLoading(false);
  };
  return (
    <Modal open={open}>
      <Box sx={style}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography as='h6' sx={{ fontSize: '24px', fontWeight: 600 }}>
            Enter Your Name
          </Typography>
          <TextField
            id='user-name'
            label='Name'
            variant='outlined'
            inputProps={{ style: customText }} // font size of input text
            sx={{ my: 3, width: '80%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendUser();
              }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Button
              variant='contained'
              onClick={sendUser}
              disabled={name == ''}
              sx={{
                textTransform: 'capitalize',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              Enter Chat
              {loading && (
                <CircularProgress size='18px' sx={{ color: '#fff', mx: 1 }} />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
