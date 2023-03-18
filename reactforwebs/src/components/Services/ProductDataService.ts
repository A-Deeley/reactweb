import { AxiosResponse } from 'axios';
import axiosInstance from './Axios';
import IProductData from '../Interfaces/IProductData';
import Product from '../Interfaces/Product';
import IFilters from '../Interfaces/IFilters';
import Department from '../Interfaces/Department';

const rootPath = 'shop/products';

const getAll = (pageNo: number): Promise<AxiosResponse<IProductData>> => {
    console.log("getting #nofilters")
    return getFiltered(undefined, pageNo);
}

const getFiltered = (filters: IFilters | undefined, pageNo: number): Promise<AxiosResponse<IProductData>> => {
    let uri: string = `${rootPath}/?page=${pageNo}`

    if (filters === undefined){
        return axiosInstance.get<unknown, AxiosResponse<IProductData>>(`${rootPath}/?page=${pageNo}`);
    }
    
    if (!filters.departmentFilters.some(dept => dept.id === 0)){
        let ids = filters.departmentFilters.map((dept : Department) => dept.id)
        let idList = ids.join(',')
        uri = `${uri}&id=${idList}`
    }

    if (filters.promoFilter){
        uri = `${uri}&promo=1`;
    }

    uri = `${uri}&min=${filters.minMaxPrice[0]}&max=${filters.minMaxPrice[1]}`;

    return axiosInstance.get<unknown, AxiosResponse<IProductData>>(uri);
}

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
    getFiltered,
    create,
    updateOrCreate,
    remove,
}

export default ProductDataService;
