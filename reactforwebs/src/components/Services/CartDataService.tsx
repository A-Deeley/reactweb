import { AxiosResponse } from 'axios';
import axiosInstance from './Axios';
import Department from '../Interfaces/Department';
import IDepartmentData from '../Interfaces/IDepartmentData';
import ICartData from '../Interfaces/ICartData';
import { Cart, CartRow } from '../Interfaces/Cart';

const rootPath = 'shop/react-cart';

const getAll = (): Promise<AxiosResponse<ICartData>> =>
    axiosInstance.get<unknown, AxiosResponse<ICartData>>('shop/carts');

const get = (): Promise<AxiosResponse<CartRow[]>> =>
    axiosInstance.get<unknown, AxiosResponse<CartRow[]>>(`${rootPath}/edit`);


const update = (productId: number, qty: number): Promise<AxiosResponse<Cart>> =>{

    return axiosInstance.post<unknown, AxiosResponse<Cart>>(`${rootPath}/edit`, {product: productId, quantity: qty});
}

const removeProduct = (rowId: number): Promise<AxiosResponse<CartRow[]>> => {
    return axiosInstance.post<unknown, AxiosResponse<CartRow[]>>(`${rootPath}/delete`, {row: rowId});
}

const CartDataService = {
    getAll,
    get,
    removeProduct,
    update,
}

export default CartDataService;
