import { Cart } from './Cart';


export interface Order {
    name : string,
    numberPhone : number,
    address : string,
    email : string,
    createAt: number,
    product : Cart
}
