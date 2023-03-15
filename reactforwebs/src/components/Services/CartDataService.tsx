import { AxiosResponse } from 'axios';
import axiosInstance from './Axios';
import Department from '../Interfaces/Department';
import IDepartmentData from '../Interfaces/IDepartmentData';
import ICartData from '../Interfaces/ICartData';
import { Cart, CartRow } from '../Interfaces/Cart';

const rootPath = 'shop/carts';

const getAll = (): Promise<AxiosResponse<ICartData>> =>
    axiosInstance.get<unknown, AxiosResponse<ICartData>>(rootPath);

const get = (): Promise<AxiosResponse<CartRow[]>> =>
    axiosInstance.get<unknown, AxiosResponse<CartRow[]>>(`shop/react-cart`);


const update = (productId: number, qty: number): Promise<AxiosResponse<Cart>> =>{

    return axiosInstance.post<unknown, AxiosResponse<Cart>>(`shop/react-cart`, {product: productId, quantity: qty});
}

const create = (data: Cart): Promise<AxiosResponse<Cart>> =>
    axiosInstance.post<Cart, AxiosResponse<Cart>>(`${rootPath}/`, data);

const updateOrCreate = (
    id: number,
    data: Cart,
): Promise<AxiosResponse<Cart>> => {
    if (id > 0) {
        return axiosInstance.put<Cart, AxiosResponse<Cart>>(
            `${rootPath}/${id}/`,
            data,
        );
    }
    return create(data);
}

const remove = (id: number): Promise<AxiosResponse<unknown>> =>
    axiosInstance.delete<unknown, AxiosResponse<unknown>>(`${rootPath}/${id}/`);

const CartDataService = {
    getAll,
    get,
    create,
    update,
    updateOrCreate,
    remove,
}

export default CartDataService;
