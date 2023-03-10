export default interface Cart {
    id: number,
    owner: number,
    rows: CartRow[]
}

interface CartRow {
    id: number,
    product: number,
    quantity: number
}