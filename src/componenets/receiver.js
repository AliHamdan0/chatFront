import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export const Receiver = ({ msg }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <Box
        sx={{
          display: 'flex',
          my: 3,
          maxWidth: { xs: '100%', md: 200, lg: 300 },
        }}
      >
        <Box className='receiverBox'>
          <Typography as='h6' sx={{ fontSize: '18px', fontWeight: 600, mx: 1 }}>
            {msg?.username}
          </Typography>
          <Typography as='p' sx={{ fontSize: '16px', fontWeight: 400, mx: 1 }}>
            {msg?.message}
          </Typography>
        </Box>
        <Image src='/images/receiver.png' alt='' width={35} height={35} />
      </Box>
    </Box>
  );
};
