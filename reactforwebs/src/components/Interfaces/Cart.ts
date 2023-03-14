import Product from "./Product"

export interface Cart {
    id: number,
    owner: number,
    rows: CartRow[]
}

export interface CartRow {
    id: number,
    product: Product,
    quantity: number
}