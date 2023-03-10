import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IProductData from './Interfaces/Product';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions, Divider, Grid, IconButton, Tooltip } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import CartDataService from './Services/CartDataService';

export type ProductCardProps = {
	product: IProductData
	}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {

	console.log(product.image_url);
	const navigate: NavigateFunction = useNavigate();
	const userToken: string | null = localStorage.getItem('demo_access_token');
	const moneyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
	})

	let realPrice = <Box sx={{ height: '100%'}}><Typography display="inline" sx={{ color: 'white'}}>.</Typography><Typography>{moneyFormatter.format(product.price)}</Typography></Box>;

	if (product.discount_type == 1){
		realPrice = 
		<Box>
			<Typography display="inline" style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'red', fontSize: '10pt'}}>{moneyFormatter.format(product.price)}</Typography>
			<Typography display="inline" style={{ color: 'green', fontSize: '10pt'}}> (-{moneyFormatter.format(product.discount_amt)})</Typography>
			<Typography style={{ fontSize: '14pt'}}>{moneyFormatter.format(product.price - product.discount_amt)}</Typography>
		</Box>
	}

	if (product.discount_type == 2){
		realPrice = 
		<Box>
			<Typography display="inline" style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'red', fontSize: '10pt'}}>{moneyFormatter.format(product.price)}</Typography>
			<Typography display="inline" style={{ color: 'green', fontSize: '10pt'}}> (-{product.discount_amt * 100}%)</Typography>
			<Typography style={{ fontSize: '14pt'}}>{moneyFormatter.format(product.price * (1 - product.discount_amt))}</Typography>
		</Box>
	}


	const handleViewClick = () => {
		navigate(`/product/${product.id}`);
	}

	const handleAddToCartClick = () => {
		console.log(`Adding ${product.name} to the cart.`);
		CartDataService.update(product.id, 1).then((response) => console.log(response)).catch((err) => console.log(err));
	}


	const btn = (userToken === null)
	? <Card variant="outlined" key={product.id} sx={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
	<CardActionArea sx={{ height: '100%'}} onClick={handleViewClick}>
		<CardMedia sx={{ objectFit: 'contain'}} component="img" image={`http://localhost:8000${product.image_url}`}/>
		<Typography variant='h6' sx={{textWrap: 'wrap' }}>{product.name}</Typography>
		{realPrice}
	</CardActionArea>
</Card>
:
<Card variant="outlined" key={product.id} sx={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
			<CardActionArea sx={{ height: '100%'}} onClick={handleViewClick}>
				<CardMedia sx={{ objectFit: 'contain'}} component="img" image={`http://localhost:8000${product.image_url}`}/>
				<Typography variant='h6' sx={{textWrap: 'wrap' }}>{product.name}</Typography>
				{product.secondary_name.length > 0 ? <Typography sx={{textWrap: 'wrap', color: 'grey' }}>{product.secondary_name}</Typography> : <></>}
				{realPrice}
			</CardActionArea>
			<Tooltip title="Ajouter au panier">
				<Button onClick={handleAddToCartClick} sx={{ backgroundColor: '#ed3024', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', ":hover": { backgroundColor: '#b51a10'}}}>
					<span style={{ color: 'white'}}>Ajouter</span><AddShoppingCartIcon sx={{ color: '#FDD100'}}/>
				</Button>
			</Tooltip>
		</Card>;

	return btn;
}