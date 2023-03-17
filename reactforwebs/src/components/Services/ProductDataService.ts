import { AxiosResponse } from 'axios';
import axiosInstance from './Axios';
import IProductData from '../Interfaces/IProductData';
import Product from '../Interfaces/Product';

const rootPath = 'shop/products';

const getAll = (pageNo: number): Promise<AxiosResponse<IProductData>> =>
    axiosInstance.get<unknown, AxiosResponse<IProductData>>(`${rootPath}/?page=${pageNo}`);

const getFiltered = (filters: string): Promise<AxiosResponse<IProductData>> =>
    axiosInstance.post<unknown, AxiosResponse<IProductData>>(`${rootPath}`, filters);

const get = (id: number): Promise<AxiosResponse<Product>> =>
    axiosInstance.get<unknown, AxiosResponse<Product>>(`${rootPath}/${id}`);

const create = (data: Product): Promise<AxiosResponse<Product>> =>
    axiosInstance.post<Product, AxiosResponse<Product>>(`${rootPath}/`, data);

const updateOrCreate = (
    id: number,
    data: Product,
): Promise<AxiosResponse<Product>> => {
    if (id > 0) {
        return axiosInstance.put<Product, AxiosResponse<Product>>(
            `${rootPath}/${id}/`,
            data,
        );
    }
    return create(data);
}

const remove = (id: number): Promise<AxiosResponse<unknown>> =>
    axiosInstance.delete<unknown, AxiosResponse<unknown>>(`${rootPath}/${id}/`);

const ProductDataService = {
    getAll,
    get,
    create,
    updateOrCreate,
    remove,
}

export default ProductDataService;
