import Department from "./Department";

interface IFilters {
    departmentFilters: Department[],
    priceRange: number[],
}

export default IFilters;