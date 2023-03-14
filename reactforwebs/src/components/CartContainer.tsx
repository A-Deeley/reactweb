import { useEffect, useState } from "react";
import CartDataService from "./Services/CartDataService";
import Cart from "./Interfaces/Cart";
import Product from "./Interfaces/Product";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function CartContainer() {
    const [cartContents, setCartContents] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const navigate: NavigateFunction = useNavigate();

    const goBack = () => {
        navigate("/");
    };

    useEffect(() => {
        CartDataService.get(1)
        .then((response) => {
            console.log("cart data loaded", response.data);
            setCartContents(response.data);
        })
        .catch((err) => {console.log("error loading cart", err);})
        .finally(() => {setLoading(false)});
    }, []);
    
    if(loading){
        return <div>Loading!</div>
    }
    else{
        return (
        <>
        <table>
            <th>rowId</th>
            <th>productId</th>
            <th>productQty</th>
            {cartContents?.rows.map((row) => {
                return <tr>
                    <td>{row.id}</td>
                    <td>{row.product}</td>
                    <td>{row.quantity}</td>
                </tr>
            })}
        </table>
        <button onClick={goBack}>go back</button>
        </>
        );
    }
}