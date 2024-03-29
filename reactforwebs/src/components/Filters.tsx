import Department from './Interfaces/Department';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import DepartmentDataService from './Services/DepartmentDataService';
import { useEffect, useRef, useState } from 'react';
import IFilters from './Interfaces/IFilters';
import { Box, Button, Divider, Skeleton, Slider, Typography } from '@mui/material';

interface FilterBox {
    dept: Department,
    isChecked: boolean,
}

interface Mark {
    value: number,
    label: string,
}

export interface FilterProps {
    onFiltersChanged: (newFilters: IFilters) => void,
}

export default function Filters({ onFiltersChanged }: FilterProps) {
    console.log("Loading Filters...");
    const [loading, setLoading] = useState(true);
    const [filterBoxes, setFilterBoxes] = React.useState<FilterBox[]>([]);
    const [priceFilters, setPriceFilters] = useState<number[]>([0, 100]);
    const [promo, setPromo] = useState<boolean>(false);
    const [marks, setMarks] = useState<Mark[]>([]);
    const maxPrice = 50;
    const moneyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
        maximumFractionDigits: 0,
	})

    useEffect(() => {
        sliderCache = [...priceFilters];
        const newMarks = [];
        const increment = 5;
        for (let i = 0; i <= maxPrice; i+=increment) {
            newMarks.push({
                value: (i / maxPrice) * 100,
                label: `${i}`
            });
        }
        console.log("finished setting marks", newMarks);
        setMarks(newMarks);
        DepartmentDataService.getAll()
            .then((response) => {
                console.log("loading departements", response.data);
                const filterItems: FilterBox[] = [];
                if (response.data.length === 0) {
                    return;
                }


                filterItems.push({
                    dept: { id: 0, name: "Afficher tout" },
                    isChecked: true,
                });
                response.data.forEach((department) => {
                    filterItems.push({
                        dept: department,
                        isChecked: department.id === 0,
                    });
                });
                setFilterBoxes(filterItems);
            })
            .catch((err) => {
                console.log("ERROR: failed to load departments.", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    let sliderCache: number[] = [...priceFilters];
    const handlePriceSlider = (event: Event, newValue: number | number[]) => {
        setPriceFilters(newValue as number[]);
    }

    const onApplyClicked = () => {
        console.log("Apply was clicked!");
        const checkedDepartments: Department[] = [];
        for (let i = 0; i < filterBoxes.length; i++){
            if (filterBoxes[i].isChecked){
                checkedDepartments.push(filterBoxes[i].dept);
            }
        }

        const minPrice = (priceFilters[0] / 100) * maxPrice;
        const _maxPrice = (priceFilters[1] / 100) * maxPrice;

        const newFilters: IFilters = {
            type: "IFilter",
            departmentFilters: checkedDepartments,
            promoFilter: promo,
            minMaxPrice: [minPrice, _maxPrice],
        };
        onFiltersChanged(newFilters);
    }

    const handleToggleDept = (value: FilterBox) => () => {
        let fb = [...filterBoxes];
        let clickedIndex = fb.findIndex(objs => objs.dept.id === value.dept.id);

        if (value.dept.id === 0 && !value.isChecked) {
            fb.forEach(item => item.isChecked = false);
            fb[0].isChecked = true;
        }
        else {
            fb[0].isChecked = false;
            fb[clickedIndex].isChecked = !value.isChecked;
        }

        setFilterBoxes(fb);
    };

    const handleTogglePromo = () => {
        const currentState = promo;
        setPromo(!currentState);
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <Divider textAlign="left"><Typography sx={{ fontWeight: 'bold' }}>Départements</Typography></Divider>
                <List dense sx={{ width: '100%'}}>
                <ListItem>
                    <Skeleton width={360} height={40} />
                </ListItem>
                <ListItem>
                    <Skeleton width={360} height={40} />
                </ListItem>
                <ListItem>
                    <Skeleton width={360} height={40} />
                </ListItem>
                <ListItem>
                    <Skeleton width={360} height={40} />
                </ListItem>
                </List>
                <Divider textAlign="left"><Typography sx={{ fontWeight: 'bold' }}>Prix ($)</Typography></Divider>
                <Skeleton />
            </Box>
        );
    }

    if (filterBoxes.length > 0) {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <Divider textAlign="left"><Typography sx={{ fontWeight: 'bold' }}>Départements</Typography></Divider>
                <List dense sx={{ paddingTop: 0}}>
                    {filterBoxes.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value.dept.id}`;
                        return (
                            <ListItem
                                key={value.dept.name}
                                disablePadding>
                                <Checkbox
                                    style={{ padding: 0, color: '#00994c' }}
                                    onChange={handleToggleDept(value)}
                                    checked={value.isChecked}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                                <ListItemButton>
                                    <ListItemText sx={{ fontWeight: 'bold' }} id={labelId} primary={value.dept.name} onClick={handleToggleDept(value)} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Divider textAlign="left"><Typography sx={{ fontWeight: 'bold' }}>Promotions</Typography></Divider>
                <List dense sx={{ paddingTop: 0}}>
                    <ListItem disablePadding>
                        <Checkbox 
                            style={{ padding: 0, color: '#00994c' }}
                            onChange={handleTogglePromo}
                            checked={promo}
                            />
                        <ListItemButton>
                            <ListItemText sx={{ fontWeight: 'bold' }} id="promo" primary="En promotion" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Prix ($)</Typography></Divider>
                <Slider valueLabelDisplay="auto" style={{ marginTop: 5, height: 8, width: '90%', color: '#00994c' }} valueLabelFormat={value => <div>{moneyFormatter.format((value / 100) * maxPrice)}</div>} value={sliderCache} onChange={handlePriceSlider} marks={marks}/>
                <Button variant="contained" onClick={onApplyClicked} sx={{ backgroundColor: '#ed3024', ':hover': { backgroundColor: '#b51a10'}}}>Appliquer</Button>
            </Box>
        );
    }
    else {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Aucun départements trouvés</Typography></Divider>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Prix ($)</Typography></Divider>
                <Slider valueLabelDisplay="auto" style={{ marginTop: 5, height: 8, width: '90%', color: '#00994c' }} valueLabelFormat={value => <div>{moneyFormatter.format((value / 100) * maxPrice)}</div>} value={sliderCache} onChange={handlePriceSlider} marks={marks}/>
                <Button variant="contained" sx={{ backgroundColor: '#ed3024', ':hover': { backgroundColor: '#b51a10'}}}>Appliquer</Button>
            </Box>
            );
    }
}



