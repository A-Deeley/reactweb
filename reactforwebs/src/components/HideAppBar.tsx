import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Tooltip } from '@mui/material';

export default function ButtonAppBar() {
	const navigate: NavigateFunction = useNavigate();
	const userToken: string | null = localStorage.getItem('demo_access_token');


	const handleClick = (): void => {
		if (userToken === null) {
			navigate('/auth/login');
		}
		else {
			navigate('/auth/logout');
		}
	};
	

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar sx={{ justifyContent: 'space-between', m: 0, p: 0, }} style={{ backgroundColor: '#ed3024' }}>
					<a href='#'><img src='Logo.png' /></a>
					<Box sx={{ display: 'flex', orientation: 'row', gap: 2 }}>
						{(userToken !== null)? <Tooltip title="Mon Panier">
							<IconButton sx={{ "&:hover": { backgroundColor: '#00994c' }, backgroundColor: '#00994c', border: 1, color: 'black' }}><ShoppingCartIcon /></IconButton>
						</Tooltip> : <></>
						}
						
						<Tooltip title={(userToken === null) ? "Se connecter" : "Se déconnecter"}>
							<IconButton sx={{ "&:hover": { backgroundColor: '#FDD100' }, backgroundColor: '#FDD100', border: 1, color: 'black' }} onClick={handleClick}>{(userToken === null) ? <LoginIcon /> : <LogoutIcon />}</IconButton>
						</Tooltip>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
}