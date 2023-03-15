import { Box, Paper } from "@mui/material";
import { CartRow } from "./Interfaces/Cart";

export interface CheckoutProps {
    cart: CartRow[]
}

export default function Checkout({ cart } : CheckoutProps) {
    const moneyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
	})

    let totalPrix = 0;

    for (let i = 0; i < cart.length; i++){
        totalPrix += cart[i].quantity * cart[i].product.price;
    }

    return (
        <Paper sx={{ height: '300px', backgroundColor: 'yellowgreen'}}>
            {moneyFormatter.format(totalPrix)}
        </Paper>
    );
}