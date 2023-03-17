import * as React from 'react'
import Container from '@mui/material/Container';
import Product from './Interfaces/Product';
import ProductCard, { ProductCardProps } from './ProductCard';
import { Navigate, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ProductDataService from './Services/ProductDataService';
import { Box, Button, Pagination, Skeleton, Typography } from '@mui/material';
import IFilters from './Interfaces/IFilters';
import CartDataService from './Services/CartDataService';
import { useSnackbar } from 'notistack';
import { Cart } from './Interfaces/Cart';
import RefreshIcon from '@mui/icons-material/Refresh';
import IProductData from './Interfaces/IProductData';

export type ProductCardContainerProps = {
	priceFilters: number[],
	activeFilters: IFilters | undefined | null,
}

// Load product data here with getFiltered(string json);


export default function ProductCardContainer({ activeFilters, priceFilters }: ProductCardContainerProps) {
	const productsNoPriceFilterCache = useRef<Product[]>([]);
	const [products, setProduct] = useState<Product[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const [productData, setProductData] = useState<IProductData>();
	const navigate: NavigateFunction = useNavigate();

	useEffect(() => {
		if (activeFilters === null || activeFilters === undefined) {
			ProductDataService.getAll(page)
				.then((response) => {
					console.log('Product data loaded', response.data);
					setProductData(response.data);
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
					ProductDataService.getAll(page)
						.then((response) => {
							console.log('Product data loaded', response.data);
							productsNoPriceFilterCache.current = response.data.results;
							setProduct(productsNoPriceFilterCache.current.filter(item => item.price <= priceFilters[priceFilters.length - 1] && item.price >= priceFilters[0]));
						})
						.catch((err) => {
							console.log('ERROR: An error occurred while category data loading', err, err.response);
						})
						.finally(() => {
							setLoading(false);
						});
				}
				else {
					setProduct(productsNoPriceFilterCache.current.filter(item => item.price <= priceFilters[priceFilters.length - 1] && item.price >= priceFilters[0]));
				}
			}
		}
	}, [activeFilters, priceFilters]);

	const handlePageChange = (page: number) => {
		setPage(page);
		console.log(page);
		ProductDataService.getAll(page)
				.then((response) => {
					console.log('Product data loaded', response.data);
					setProductData(response.data);
					productsNoPriceFilterCache.current = response.data.results;
					setProduct(response.data.results);
				})
				.catch((err) => {
					console.log('ERROR: An error occurred while category data loading', err, err.response);
				});
	}
	

	if (loading) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
				{Array(15).fill(<Skeleton variant="rectangular" width="136px" height="172px" />)}
			</Box>
		);
	}

	if (products.length > 0){
		let nbPages = Math.ceil((productData?.count ?? 0) / 5);
		let pagination = 
		<Box sx={{ bottom: 0, display: 'flex', justifyContent: 'center', marginTop: '1em'}}>
			<Pagination count={nbPages} variant="outlined" shape="rounded" onChange={(e, page) => handlePageChange(page)} page={page}/>
		</Box>;

		if (nbPages <= 1){
			pagination = <></>;
		}
		return (
			<>
				<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5, alignItems: 'stretch' }}>
				{products.map((product) => {
					return <ProductCard product={product} />
				})}
				</Box>
				{pagination}
			</>
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