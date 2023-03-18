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
import { SnackbarProvider, useSnackbar } from 'notistack'
import BadgeContext, { ICartBadgeContext } from './Context/CartBadgeContext';
import { useContext, useState } from 'react';
import { baseURL } from './Services/Axios';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ProductDataService from './Services/ProductDataService';

export type ProductCardProps = {
	product: IProductData
	}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {

	const badgeContext: ICartBadgeContext = useContext(BadgeContext);
	const navigate: NavigateFunction = useNavigate();
	const [outOfStock, setOutOfStock] = useState<boolean>(product.qty <= 0);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const userToken: string | null = localStorage.getItem('demo_access_token');
	const moneyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
	})

	let realPrice = <Box><Typography display="inline" sx={{ color: 'white'}}>.</Typography><Typography>{moneyFormatter.format(product.price)}</Typography></Box>;
	const secondaryText = product.secondary_name.length > 0 ? <Typography sx={{ whiteSpace: 'wrap', paddingInline: '1em', color: 'grey', flexGrow: '1' }}>{product.secondary_name}</Typography> : <></>;

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
		console.log(`Adding product to the cart.`, product);
		let productStillInStock: boolean | null = true;
		ProductDataService.get(product.id)
		.then((response) => {
			const responseProduct = response.data;
			productStillInStock = responseProduct.qty > 0;
		})
		.catch((err) => {
			console.log("error checking product inventory. ", err);
			enqueueSnackbar("Une érreur est survenu. Réessayez plus tard.", { variant: 'error'});
			productStillInStock = null;
		})

		if (!productStillInStock){
			enqueueSnackbar(`${product.name} n'est plus en stock, désolé.`, { variant: 'warning'});
			return;
		}

		CartDataService.updateRow(product.id, 1)
		.then((response) => {
			console.log("success", response)
			badgeContext.update(1);
			enqueueSnackbar(`${product.name} ajouté au panier!`,  {variant: "success"});
		})
		.catch((err) => {
			if (err.response.status === 406){
				enqueueSnackbar(`${product.name} n'est plus en stock, désolé.`, { variant: 'warning'});
				setOutOfStock(true);
			}
		});
	}


	let card = 
	<Card variant="outlined" key={product.id} sx={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
		<CardActionArea sx={{ height: '100%'}} onClick={handleViewClick}>
			<CardMedia sx={{ objectFit: 'contain'}} component="img" image={`${baseURL}${product.image_url}`}/>
			<Typography variant='h6' sx={{textWrap: 'wrap' }}>{product.name}</Typography>
			{secondaryText}
			{realPrice}
		</CardActionArea>
	</Card>;

	if (userToken !== null){
		card = 
		<Card variant="outlined" key={product.id} sx={{ display: 'flex', maxWidth: '15%', flexDirection: 'column', justifyContent: 'space-between'}}>
			<CardActionArea sx={{ flexGrow: 1}} onClick={handleViewClick}>
				<CardMedia sx={{ objectFit: 'contain'}} component="img" image={`${baseURL}${product.image_url}`}/>
				<Typography variant='h6' sx={{textWrap: 'wrap' }}>{product.name}</Typography>
				{secondaryText}
				{realPrice}
			</CardActionArea>
			<Tooltip title="Ajouter au panier">
				<Button onClick={handleAddToCartClick} sx={{ backgroundColor: '#ed3024', display: 'flex', justifyContent: 'center', height: '3rem', ":hover": { backgroundColor: '#b51a10'}}}>
					<span style={{ color: 'white'}}>Ajouter</span><AddShoppingCartIcon sx={{ color: '#FDD100'}}/>
				</Button>
			</Tooltip>
		</Card>;

		if (outOfStock){
			card = 
			<Card variant="outlined" key={product.id} sx={{ display: 'flex', maxWidth: '15%', flexDirection: 'column', justifyContent: 'space-between'}}>
				<CardActionArea sx={{ flexGrow: 1}} onClick={handleViewClick}>
					<CardMedia sx={{ objectFit: 'contain'}} component="img" image={`${baseURL}${product.image_url}`}/>
					<Typography variant='h6' sx={{textWrap: 'wrap' }}>{product.name}</Typography>
					{secondaryText}
					{realPrice}
				</CardActionArea>
				<Tooltip title="Produit non disponible">
					<Button sx={{ backgroundColor: 'darkGrey', display: 'flex', justifyContent: 'center', height: '3rem', ":hover": { backgroundColor: 'grey'}}}>
						<span style={{ color: 'white'}}>Hors stock</span><RemoveShoppingCartIcon sx={{ color: 'red'}}/>
					</Button>
				</Tooltip>
			</Card>;
		}
	}

	return card;
}