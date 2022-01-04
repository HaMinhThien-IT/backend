import { BuyUser } from './BuyUser';
import { Cart } from './Cart';


export interface Order {
   order_id:string,
   user_id : number,
   time_order : number,
   isTemporary :boolean
}
export interface OrderWithDetail extends Order{
    orderProducts : Cart[],
    user : BuyUser
}
