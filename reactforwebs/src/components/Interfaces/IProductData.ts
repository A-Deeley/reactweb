import Product from "./Product";

export default interface IProductData {
    count: number,
    results: Product[]
    next: string | null,
    previous: string | null
}