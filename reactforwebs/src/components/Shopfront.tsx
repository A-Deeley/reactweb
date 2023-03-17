import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Filters from './Filters';
import ProductContainer from './ProductCardContainer';
import { FilterProps } from './Filters';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Product from './Interfaces/Product';
import ProductDataService from './Services/ProductDataService';
import DepartmentDataService from './Services/DepartmentDataService';
import Department from './Interfaces/Department';
import Skeleton from '@mui/material/Skeleton';
import { Box, Container, Fab, List, ListItem } from '@mui/material';
import IFilters from './Interfaces/IFilters';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { green } from '@mui/material/colors';

export const Shopfront = () => {
	console.log("initialising shopfront...");
	const [filters, setFilters] = useState<IFilters>();
	const userToken: string | null = localStorage.getItem('demo_access_token');

	const onFiltersChanged = (newFilters: IFilters) => {
		console.log("onFiltersChanged triggered");
		setFilters(newFilters);
	}

	const fabStyle = {
		right: 20,
		bottom: 20, 
		position: 'fixed',
		bgcolor: green[700],
		'&:hover': {
			bgcolor: green[500],
		},
	};

	// Filters loads with everything available and will raise a onFilterChanged when the user modifies
	return (
		<>
		<Grid container spacing={2} sx={{ m: 2, width: '75%', marginInline: 'auto'}}>
			<Grid xs={2}>
				<Filters onFiltersChanged={onFiltersChanged} />
			</Grid>
			<Grid xs={10}>
				<ProductContainer activeFilters={filters} priceFilters={[1,100]}/>
			</Grid>
		</Grid>
		
		</>
	);
}