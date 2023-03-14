import { useEffect, useState } from "react";
import CartDataService from "./Services/CartDataService";
import { CartRow } from "./Interfaces/Cart";
import Product from "./Interfaces/Product";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function CartContainer() {
    const [cartContents, setCartContents] = useState<CartRow[] | null>(null);
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
        .finally(() => {setLoading(false)});
    }, []);
    
    if(loading){
        return <div>Loading!</div>
    }
    else{
        console.log("finished loading. Content to display is", cartContents);
        const jsx = 
        <table>
            <th>rowId</th>
            <th>img</th>
            <th>productId</th>
            <th>productQty</th>
            {cartContents?.map((row) => {
                console.log("hi", row);
                return <tr>
                    <td>{row.id}</td>
                    <td><img src={`http://localhost:8000${row.product.image_url}`}/></td>
                    <td>{row.product.name}</td>
                    <td>{row.quantity}</td>
                </tr>
            })}
        </table>;

        return (
            <>
                {jsx}
                <button onClick={goBack}>go back</button>
            </>);
    }
}