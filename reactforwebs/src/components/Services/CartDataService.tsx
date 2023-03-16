import { AxiosResponse } from 'axios';
import axiosInstance from './Axios';
import Department from '../Interfaces/Department';
import IDepartmentData from '../Interfaces/IDepartmentData';
import ICartData from '../Interfaces/ICartData';
import { Cart, CartRow } from '../Interfaces/Cart';

const rootPath = 'shop/react-cart';

const get = (): Promise<AxiosResponse<CartRow[]>> =>
    axiosInstance.get<unknown, AxiosResponse<CartRow[]>>(`${rootPath}/getAllRows`);


const updateRow = (productId: number, qty: number): Promise<AxiosResponse<Cart>> =>{

    return axiosInstance.post<unknown, AxiosResponse<Cart>>(`${rootPath}/editRow`, {product: productId, quantity: qty});
}

const removeProduct = (rowId: number): Promise<AxiosResponse<CartRow[]>> => {
    return axiosInstance.post<unknown, AxiosResponse<CartRow[]>>(`${rootPath}/deleteRow`, {row: rowId});
}

const updateCart = (rowQtyJson: string): Promise<AxiosResponse<CartRow[]>> =>
    axiosInstance.post<unknown, AxiosResponse<CartRow[]>>(`${rootPath}/updateCart`, rowQtyJson);

const CartDataService = {
    get,
    removeProduct,
    updateRow,
    updateCart,
}

export default CartDataService;
