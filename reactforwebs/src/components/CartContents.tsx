import { Box, Button, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CartRow } from "./Interfaces/Cart";
import Image from 'material-ui-image'
import CartDataService from "./Services/CartDataService";
import { SnackbarProvider, useSnackbar } from 'notistack'
import StoreIcon from '@mui/icons-material/Store';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import BadgeContext, { ICartBadgeContext } from "./Context/CartBadgeContext";
import { baseURL } from "./Services/Axios";
import ProductDataService from "./Services/ProductDataService";

export interface CartContentProps {
    cart: CartRow[],
    handleCartUpdate: React.Dispatch<React.SetStateAction<CartRow[]>>
}

export default function CartContents({cart, handleCartUpdate} : CartContentProps) {
        const navigate: NavigateFunction = useNavigate();
        const [cachedCart, setCartCache] = useState<CartRow[]>([]);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const [cartChanged, setCartChanged] = useState<boolean>(false);
        const badgeContext: ICartBadgeContext = useContext(BadgeContext);
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
                const cartRows: CartRow[] = response.data;
                enqueueSnackbar("Produit retiré", { variant: 'success'});
                handleCartUpdate(response.data);
                const cartRowQuantities: number[] = cartRows.map((row) => row.quantity);
                badgeContext.init(cartRowQuantities);
            })
            .catch((err) => {
                enqueueSnackbar("Une erreur est survenu.", { variant: 'error' });
            });

        }

        const constrainInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: CartRow) => {
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

            if (+e.target.value > row.product.qty){
                e.target.value = `${currentRow.quantity}`;
                enqueueSnackbar("Quantité demandé dépasse le stock disponible.", { variant: 'warning' });
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
                    const cartRows: CartRow[] = response.data;
                    handleCartUpdate(cartRows);
                    setCartChanged(false);
                    enqueueSnackbar("Panier mis à jour!", { variant: 'success'});
                    const cartRowQuantities: number[] = cartRows.map((row) => row.quantity);
                    badgeContext.init(cartRowQuantities);
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
                        const rowProduct = row.product;
                        current++;
                        let rowRealPriceElement = 
                        <>
                            <Typography style={{ fontWeight: 'bold'}}>Chaque</Typography>
                            <Typography>{moneyFormatter.format(rowProduct.price)}</Typography>
                        </>;

                        let realPrice = rowProduct.price;
                        if (rowProduct.discount_type > 0){
                            let realPriceText = moneyFormatter.format(realPrice);
                            if (rowProduct.discount_type === 1){
                                realPrice = rowProduct.price - rowProduct.discount_amt;
                                realPriceText = `${moneyFormatter.format(realPrice)} (-${moneyFormatter.format(rowProduct.discount_amt)})`;
                            }

                            if (rowProduct.discount_type === 2){
                                realPrice = rowProduct.price * (1 - rowProduct.discount_amt);
                                realPriceText = `${moneyFormatter.format(realPrice)} (-${rowProduct.discount_amt * 100}%)`;
                            }

                            

                            rowRealPriceElement = 
                            <>
                                <Typography style={{ fontWeight: 'bold'}}>Chaque</Typography>
                                <Typography sx={{ }}>{realPriceText}</Typography>
                                <Typography display="inline" style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'red', fontSize: '10pt'}}>{moneyFormatter.format(row.product.price)}</Typography>
                            </>
                        }

                        return (
                            <>
                            <Grid key={row.id} container sx={{ marginBlock: '1em', textAlign: 'start' }}>
                                <Grid xs={2}>
                                    <img alt={`product_${row.product.name}`} src={`${baseURL}${row.product.image_url}`} style={{ maxWidth: '100%'}}/>
                                </Grid>
                                <Grid container xs={10}>
                                    <Grid xs={4} style={{ marginTop: '0'}}>
                                        <Typography variant='h6' sx={{textWrap: 'wrap' }}>{row.product.name}</Typography>
                                        {row.product.secondary_name.length > 0 ? <Typography sx={{textWrap: 'wrap', color: 'grey' }}>{row.product.secondary_name}</Typography> : <></>}
                                    </Grid>
                                    <Grid xs={3}>
                                        {rowRealPriceElement}                                        
                                    </Grid>
                                    <Grid xs={2} style={{ textAlign: 'center'}}>
                                        <Typography style={{ fontWeight: 'bold'}}>Quantité</Typography>
                                        <TextField size="small" type="number" value={row.quantity} onChange={e => constrainInput(e, row)}/>
                                        <Typography style={{ fontStyle: 'italic' }}>(en stock: {row.product.qty})</Typography>
                                    </Grid>
                                    <Grid xs={3} style={{ textAlign: 'end'}}>
                                        <Typography style={{ fontWeight: 'bold '}}>Total pour l'article</Typography>
                                        <Typography>{moneyFormatter.format(realPrice * row.quantity)}</Typography>
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