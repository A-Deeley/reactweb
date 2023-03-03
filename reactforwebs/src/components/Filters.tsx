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
import { Box, Divider, Skeleton, Slider, Typography } from '@mui/material';

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
    const [marks, setMarks] = useState<Mark[]>([]);

    useEffect(() => {
        DepartmentDataService.getAll()
            .then((response) => {
                const newMarks = [...marks];
                for (let i = 0; i <= 10; i++) {
                    newMarks.push({
                        value: i * 10,
                        label: `${i * 10}`
                    });
                }
                setMarks(newMarks);
                const filterItems: FilterBox[] = [];
                if (response.data.results.length === 0) {
                    return;
                }


                filterItems.push({
                    dept: { id: 0, name: "Afficher tout" },
                    isChecked: true,
                });
                response.data.results.forEach((department) => {
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

    const handlePriceSlider = (event: Event, newValue: number | number[]) => {
        setPriceFilters(newValue as number[]);
        const activeDepartments: Department[] = [];
        filterBoxes.forEach(item => { if (item.isChecked) { activeDepartments.push(item.dept); } });
        const newFilters: IFilters = {
            departmentFilters: activeDepartments,
            priceRange: newValue as number[]
        };

        onFiltersChanged(newFilters);
    }

    const handleToggle = (value: FilterBox) => () => {
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
        const activeDepartments: Department[] = [];
        fb.forEach(item => { if (item.isChecked) { activeDepartments.push(item.dept); } });
        const newFilters: IFilters = {
            departmentFilters: activeDepartments,
            priceRange: priceFilters
        };

        onFiltersChanged(newFilters);
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Départements</Typography></Divider>
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
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Prix ($)</Typography></Divider>
                <Skeleton />
            </Box>
        );
    }

    if (filterBoxes.length > 0) {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Départements</Typography></Divider>
                <List dense sx={{ paddingTop: 0}}>
                    {filterBoxes.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value.dept.id}`;
                        return (
                            <ListItem
                                key={value.dept.name}
                                disablePadding>
                                <Checkbox
                                    style={{ padding: 0 }}
                                    onChange={handleToggle(value)}
                                    checked={value.isChecked}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                                <ListItemButton>
                                    <ListItemText sx={{ fontWeight: 'bold' }} id={labelId} primary={value.dept.name} onClick={handleToggle(value)} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Divider textAlign="left"><Typography sx={{ textAlign: 'start', fontWeight: 'bold' }}>Prix ($)</Typography></Divider>
                <Slider valueLabelDisplay="auto" style={{ marginTop: 5, height: 8, width: '90%' }} value={priceFilters} valueLabelFormat={value => <div>${value}</div>} onChange={handlePriceSlider} marks={marks}/>
            </Box>
        );
    }
    else {
        return (
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: '#fe0', border: 1, borderRadius: '10px' }}>
                <ListItem>
                    <Typography>Aucuns départements trouvés.</Typography>
                </ListItem>
            </List>
            );
    }
}



