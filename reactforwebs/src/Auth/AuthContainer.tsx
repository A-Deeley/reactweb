import { Outlet } from 'react-router-dom';
import { Avatar, Box, CssBaseline, Container } from '@mui/material';

export default function AuthContainer(): JSX.Element {
  //console.log('Load Auth Container Component');

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', my: 8 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', m: 1 }} />
        <Outlet />
      </Box>
    </Container>
  );
}
