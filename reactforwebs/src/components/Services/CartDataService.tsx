import { AxiosResponse } from 'axios';
import axiosInstance from 'axios';
import Department from '../Interfaces/Department';
import IDepartmentData from '../Interfaces/IDepartmentData';
import ICartData from '../Interfaces/ICartData';
import Cart from '../Interfaces/Cart';

const rootPath = 'http://localhost:8000/shop/carts';

const getAll = (): Promise<AxiosResponse<ICartData>> =>
    axiosInstance.get<unknown, AxiosResponse<ICartData>>(rootPath);

const get = (id: number): Promise<AxiosResponse<Cart>> =>
    axiosInstance.get<unknown, AxiosResponse<Cart>>(`${rootPath}/${id}`);


const update = (productId: number, qty: number): Promise<AxiosResponse<Cart>> =>{

    console.log("calling update");
    return axiosInstance.post<unknown, AxiosResponse<Cart>>(`http://localhost:8000/shop/react-cart`, {product: productId, quantity: qty});
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
