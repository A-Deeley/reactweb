import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IProductData from './Interfaces/Product';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export type ProductCardProps = {
	product: IProductData
	}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {

	const navigate: NavigateFunction = useNavigate();

	const handleViewClick = () => {
		navigate(`/product/${product.id}`);
	}

	return (
		<Card sx={{ maxWidth: 345 }} key={product.id} >
			<CardHeader
				title={product.name}
			/>
			<CardContent>
				<Typography>${product.price}</Typography>
			</CardContent>
			<CardActions>
				<Button variant="contained" onClick={handleViewClick}>Plus d'info</Button>
			</CardActions>
		</Card>
	);
}