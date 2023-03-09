import { useEffect } from "react";
import ProductDataService from "./Services/ProductDataService";

export interface ProductInfoProps {
    productId: number,
}

export default function ProductInfo({ productId }: ProductInfoProps): JSX.Element {

    useEffect(() => {
        ProductDataService.get(productId)
        .then(() => {

        })
        .catch(() => {

        });
    }, []);

    return (<></>);
}