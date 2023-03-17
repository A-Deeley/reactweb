import { Box, Paper, Typography } from "@mui/material";
import { CartRow } from "./Interfaces/Cart";

export interface CheckoutProps {
    cart: CartRow[]
}

export default function Checkout({ cart } : CheckoutProps) {
    const moneyFormatter = new Intl.NumberFormat('en-CA', {
		style: 'currency',
		currency: 'CAD',
	})

    let sousTotal = 0;
    let totalTps = 0;
    let totalTvq = 0;

    for (let i = 0; i < cart.length; i++){
        const loopRow = cart[i];
        let priceUnit = loopRow.product.price;
        if (loopRow.product.discount_type === 1){
            priceUnit -= loopRow.product.discount_amt;
        }

        if (loopRow.product.discount_type === 2) {
            priceUnit *= (1 - loopRow.product.discount_amt);
        }

        sousTotal += (priceUnit * loopRow.quantity);

        if (loopRow.product.apply_tps){
            totalTps += (0.09975 * priceUnit * loopRow.quantity);
        }

        if (loopRow.product.apply_tvq){
            totalTvq += (0.05 * priceUnit * loopRow.quantity);
        }
    }

    return (
        <Paper sx={{ height: '300px', backgroundColor: 'green', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Typography>Sous-total: {moneyFormatter.format(sousTotal)}</Typography> 
            <Typography>TPS (5.000%): {moneyFormatter.format(totalTps)}</Typography> 
            <Typography>TVQ (9.975%): {moneyFormatter.format(totalTvq)}</Typography> 
            <Typography>Total: {moneyFormatter.format(sousTotal + totalTps + totalTvq)}</Typography> 
        </Paper>
    );
}