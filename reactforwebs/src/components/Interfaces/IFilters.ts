import Department from "./Department";

interface IFilters {
    type: 'IFilter';
    departmentFilters: Department[],
    promoFilter: boolean,
    minMaxPrice: number[],
}

export default IFilters;