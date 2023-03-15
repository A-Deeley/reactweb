import { Box, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CartRow } from "./Interfaces/Cart";
import Image from 'material-ui-image'
import CartDataService from "./Services/CartDataService";

export interface CartContentProps {
    cart: CartRow[],
    handleCartUpdate: React.Dispatch<React.SetStateAction<CartRow[]>>
}

export default function CartContents({cart, handleCartUpdate} : CartContentProps) {
        const navigate: NavigateFunction = useNavigate();
        const moneyFormatter = new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        })
    
        

        
        let current = 0;
        return (
            <Box>
                {cart?.map((row) => {
                    current++;
                    return (
                        <>
                        <Grid container sx={{ marginBlock: '1em', textAlign: 'start' }}>
                            <Grid xs={2}>
                                <img alt={`product_${row.product.name}`} src={`http://localhost:8000${row.product.image_url}`} style={{ maxWidth: '100%'}}/>
                            </Grid>
                            <Grid container xs={10}>
                                <Grid xs={4} style={{ marginTop: '0'}}>
                                    <Typography variant='h6' sx={{textWrap: 'wrap' }}>{row.product.name}</Typography>
                                    {row.product.secondary_name.length > 0 ? <Typography sx={{textWrap: 'wrap', color: 'grey' }}>{row.product.secondary_name}</Typography> : <></>}
                                </Grid>
                                <Grid xs={3}>
                                    <Typography style={{ fontWeight: 'bold'}}>Chaque</Typography>
                                    <Typography>{moneyFormatter.format(row.product.price)}</Typography>
                                </Grid>
                                <Grid xs={2} style={{ textAlign: 'center'}}>
                                    <Typography style={{ fontWeight: 'bold'}}>Quantité</Typography>
                                    <TextField size="small" type="number" defaultValue={row.quantity}/>
                                </Grid>
                                <Grid xs={3} style={{ textAlign: 'end'}}>
                                    <Typography style={{ fontWeight: 'bold '}}>Total pour l'article</Typography>
                                    <Typography>{moneyFormatter.format(row.product.price * row.quantity)}</Typography>
                                </Grid>
                                <Grid style={{ alignItems: 'end', display: 'flex', gap: '1em'}}>
                                    <Typography sx={{ color: 'grey', fontStyle: 'italic'}}><Link sx={{ color: 'inherit', cursor: 'pointer'}} underline="hover">modifier</Link></Typography>
                                    <Typography sx={{ color: 'red', fontStyle: 'italic'}}><Link sx={{ color: 'inherit', cursor: 'pointer'}} underline="hover">enlever</Link></Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {(current < cart.length) ? <Divider /> : <></>}
                        </>
                    );
                    
                })}
            </Box>
        );
    }