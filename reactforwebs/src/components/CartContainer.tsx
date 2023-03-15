import { useEffect, useState } from "react";
import CartDataService from "./Services/CartDataService";
import { CartRow } from "./Interfaces/Cart";
import Product from "./Interfaces/Product";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import CartContents from "./CartContents";
import Checkout from "./Checkout";


export default function CartContainer() {
    const [cartContent, setCartContents] = useState<CartRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 
    const navigate: NavigateFunction = useNavigate();
    

    const goBack = () => {
        navigate("/");
    };

    useEffect(() => {
        CartDataService.get()
        .then((response) => {
            console.log("cart data loaded", response.data);
            setCartContents(response.data);
        })
        .catch((err) => {console.log("error loading cart", err);})
    }, []);
    
        return (<>
            <Grid container spacing={2} sx={{ marginTop: '1em', maxWidth: '75%', marginInline: 'auto'}}>
                <Grid xs={8}>
                    <CartContents cart={cartContent} handleCartUpdate={setCartContents}/>
                </Grid>
                <Grid xs={1} />
                <Grid xs={3}>
                    <Checkout cart={cartContent}/>
                </Grid>
            </Grid>
            
            </>);
    }