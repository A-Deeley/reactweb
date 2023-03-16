import { Box, Button, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CartRow } from "./Interfaces/Cart";
import Image from 'material-ui-image'
import CartDataService from "./Services/CartDataService";
import { SnackbarProvider, useSnackbar } from 'notistack'
import StoreIcon from '@mui/icons-material/Store';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';

export interface CartContentProps {
    cart: CartRow[],
    handleCartUpdate: React.Dispatch<React.SetStateAction<CartRow[]>>
}

export default function CartContents({cart, handleCartUpdate} : CartContentProps) {
        const navigate: NavigateFunction = useNavigate();
        const [cachedCart, setCartCache] = useState<CartRow[]>([]);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const [cartChanged, setCartChanged] = useState<boolean>(false);
        let cartObjects = Object.values(cachedCart);
        const moneyFormatter = new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        })    

        useEffect(() => {
            setCartCache(JSON.parse(JSON.stringify(cart)));
            cartObjects = Object.values(cachedCart);
        }, [cart]);
        
        const handleRemoveClick = (rowId: number) => {
            console.log("Removing row from cart", rowId);
            CartDataService.removeProduct(rowId).then((response) => {
                enqueueSnackbar("Produit retiré", { variant: 'success'});
                handleCartUpdate(response.data);
            })
            .catch((err) => {
                enqueueSnackbar("Une erreur est survenu.", { variant: 'error' });
            });

        }

        const preventNegatives = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: CartRow) => {
            const copy = [...cachedCart];
            let rowId = copy.findIndex((_row) => _row.id === row.id); 
            let currentRow = copy[rowId];
            console.log(e.target.value);
            if (e.target.value == ''){
                e.target.value = `${currentRow.quantity}`;
                return;
            }

            if (+e.target.value < 0){
                e.target.value = '0';
                currentRow.quantity = 0;
                if (!cartChanged){
                    setCartChanged(true);
                }
                setCartCache(copy);
                return;
            }
            
            console.log('updating value');
            currentRow.quantity = +e.target.value;
            if (!cartChanged){
                setCartChanged(true);
            }
            setCartCache(copy);
        }

        const handleResetCart = () => {
            setCartCache(cart);
            setCartChanged(false);
        }

        const handleUpdateCart = () => {
                const newCart = [...cachedCart];
                const rowQtyPairs = newCart.map((row) => { return {id: row.id, qty: row.quantity}});
                CartDataService.updateCart(JSON.stringify(rowQtyPairs))
                .then((response) => {
                    handleCartUpdate(response.data);
                    setCartChanged(false);
                    enqueueSnackbar("Panier mis à jour!", { variant: 'success'});
                })
                .catch((err) => {
                    enqueueSnackbar("Une erreur est survenue.", { variant: 'error'});
                });
        }

        
        let current = 0;

        if (cartObjects.length > 0){
            return (
                <Box>
                    <Grid sx={{ justifyContent: 'end', display: 'flex', gap: 2}}>
                        <Button variant='contained' onClick={handleResetCart} disabled={!cartChanged} color='error'><RefreshIcon />Annuler changements</Button>
                        <Button variant='contained' onClick={handleUpdateCart} disabled={!cartChanged} color='success'><CheckIcon />Mettre à jour</Button>
                    </Grid>
                    {cartObjects.map((row) => {
                        current++;
                        return (
                            <>
                            <Grid key={row.id} container sx={{ marginBlock: '1em', textAlign: 'start' }}>
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
                                        <TextField size="small" type="number" value={row.quantity} onChange={e => preventNegatives(e, row)}/>
                                    </Grid>
                                    <Grid xs={3} style={{ textAlign: 'end'}}>
                                       <Typography style={{ fontWeight: 'bold '}}>Total pour l'article</Typography>
                                        <Typography>{moneyFormatter.format(row.product.price * row.quantity)}</Typography>
                                    </Grid>
                                    <Grid style={{ alignItems: 'end', display: 'flex', gap: '1em'}}>
                                        <Typography sx={{ color: 'red', fontStyle: 'italic'}}><Link sx={{ color: 'inherit', cursor: 'pointer'}} underline="hover" onClick={() => handleRemoveClick(row.id)}>enlever</Link></Typography>
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
        
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography sx={{ fontWeight: 'bold'}}>Votre panier est vide!</Typography>
                <Button variant='contained' onClick={() => navigate('/')}><StoreIcon /> Magasiner</Button>
            </Box>
        );

        
    }