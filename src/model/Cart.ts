
import { OrderWithDetail } from './Order';
import { Product } from './Product';
export interface Cart {
    id: string,
    order_product_id: string,
    order_id : string
    price: number,
    quantity : number
    product?:Product
}
export const order:OrderWithDetail = {
    order_id : '1',
    user_id : 1,
    isTemporary : true,
    time_order : 2-2-2002,
    orderProducts : [
        {
            id : '1',
            order_id : '1',
            order_product_id : '12',
            price : 123,
            quantity : 12,
            product:{
                id : '1',
                name:'IPhone 14',
                price : 122222,
                image: 'anh1.npg'
            }           
        }
    ],
    user :{
        user_id : 1,
        nameUser : '',
        numberPhone : '0981832226',
        address : 'BMT',
        email : 'Bronze.hmt@gmail.com'
    }


}