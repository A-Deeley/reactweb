import { AxiosResponse } from 'axios';
import axiosInstance from 'axios';
import Department from '../Interfaces/Department';
import IDepartmentData from '../Interfaces/IDepartmentData';

const rootPath = 'http://localhost:8000/shop/departments';

const getAll = (): Promise<AxiosResponse<IDepartmentData>> =>
    axiosInstance.get<unknown, AxiosResponse<IDepartmentData>>(rootPath);

const get = (id: number): Promise<AxiosResponse<Department>> =>
    axiosInstance.get<unknown, AxiosResponse<Department>>(`${rootPath}/${id}`);

const create = (data: Department): Promise<AxiosResponse<Department>> =>
    axiosInstance.post<Department, AxiosResponse<Department>>(`${rootPath}/`, data);

const updateOrCreate = (
    id: number,
    data: Department,
): Promise<AxiosResponse<Department>> => {
    if (id > 0) {
        return axiosInstance.put<Department, AxiosResponse<Department>>(
            `${rootPath}/${id}/`,
            data,
        );
    }
    return create(data);
}

const remove = (id: number): Promise<AxiosResponse<unknown>> =>
    axiosInstance.delete<unknown, AxiosResponse<unknown>>(`${rootPath}/${id}/`);

const DepartmentDataService = {
    getAll,
    get,
    create,
    updateOrCreate,
    remove,
}

export default DepartmentDataService;
