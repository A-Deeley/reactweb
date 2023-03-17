import Department from "./Department";

interface IFilters {
    departmentFilters: Department[],
    promoFilter: boolean | null,
}

export default IFilters;