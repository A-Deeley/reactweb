import Vendor from './Vendor';
import Dept from './Department';

interface Product {
	id: number,
	cup: string,
	name: string,
	discount_amt: number,
	discount_type: boolean,
	quantityType: string,
	company: number,
	department: number,
	price: number,
	qty: number,
	apply_tvq: boolean,
	apply_tps: boolean,	
}

export default Product;