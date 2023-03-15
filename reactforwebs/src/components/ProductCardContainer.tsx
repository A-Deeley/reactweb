import * as React from 'react'
import Container from '@mui/material/Container';
import Product from './Interfaces/Product';
import ProductCard, { ProductCardProps } from './ProductCard';
import { Navigate, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ProductDataService from './Services/ProductDataService';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import IFilters from './Interfaces/IFilters';
import CartDataService from './Services/CartDataService';
import { useSnackbar } from 'notistack';
import { Cart } from './Interfaces/Cart';
import RefreshIcon from '@mui/icons-material/Refresh';

export type ProductCardContainerProps = {
	activeFilters: IFilters | null | undefined,
}

// Load product data here with getFiltered(string json);


export default function ProductCardContainer({ activeFilters }: ProductCardContainerProps) {
	const productsNoPriceFilterCache = useRef<Product[]>([]);
	const [products, setProduct] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const navigate: NavigateFunction = useNavigate();

	useEffect(() => {
		if (activeFilters === null || activeFilters === undefined) {
			ProductDataService.getAll()
				.then((response) => {
					console.log('Product data loaded', response.data);
					productsNoPriceFilterCache.current = response.data.results;
					setProduct(response.data.results);
				})
				.catch((err) => {
					console.log('ERROR: An error occurred while category data loading', err, err.response);
				})
				.finally(() => {
					setLoading(false);
				});
		}
		else {
			if (activeFilters !== null && activeFilters !== undefined) {
				if (activeFilters.departmentFilters.findIndex(dept => dept.id === 0) > -1) {
					ProductDataService.getAll()
						.then((response) => {
							console.log('Product data loaded', response.data);
							productsNoPriceFilterCache.current = response.data.results;
							setProduct(productsNoPriceFilterCache.current.filter(item => item.price <= activeFilters.priceRange[activeFilters.priceRange.length - 1] && item.price >= activeFilters.priceRange[0]));
						})
						.catch((err) => {
							console.log('ERROR: An error occurred while category data loading', err, err.response);
						})
						.finally(() => {
							setLoading(false);
						});
				}
				else {
					setProduct(productsNoPriceFilterCache.current.filter(item => item.price <= activeFilters.priceRange[activeFilters.priceRange.length - 1] && item.price >= activeFilters.priceRange[0]));
				}
			}
		}
	}, [activeFilters]);
	

	if (loading) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
				{Array(15).fill(<Skeleton variant="rectangular" width="136px" height="172px" />)}
			</Box>
		);
	}

	if (products.length > 0){
		return (
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
			{products.map((product) => {
				return <ProductCard product={product} />
			})}
			</Box>
		);
	}
	else {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Typography sx={{ fontWeight: 'bold'}}>Aucun article trouvé :(</Typography>
				<Button variant='contained' onClick={() => window.location.reload()}>Rafraichir<RefreshIcon /></Button>
			</Box>
		);
	}
}