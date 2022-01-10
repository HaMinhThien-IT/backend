import { QueryResult } from "pg";
import { pool } from "../ConnectDB";
import { BuyUser } from "../model/BuyUser";
import { OrderWithDetail } from "../model/Order";
import { v4 as uuidv4 } from 'uuid';
class ServicesOrderProduct {
    getListOrder = async (user_id: number, pageSize: number, page: number) => {
        let listOrderUser: QueryResult = await pool.query(`select * from order_product join orders on order_product.order_id  = orders.order_id join product on product.id  = order_product.id  	
    join buyuser  on buyuser.user_id  = orders.user_id where orders.order_id 
    in (select order_id from  orders where user_id = ${user_id} and isTemporary = true  group by order_id   LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize})    
    `)

        let countPage = await pool.query(`select order_id from  orders where user_id = 3 and isTemporary = true  group by order_id   
    `)
        let getAll = listOrderUser.rows

        let listOrder: OrderWithDetail[] = []
        let allId: string[] = []
        getAll.map(item => allId.push(item.order_id))
        allId = Array.from(new Set(allId))
        allId.map(order_id => {
            const order: OrderWithDetail = {
                order_id: order_id,
                user_id: Number(user_id),
                isTemporary: true,
                time_order: 2 - 2 - 2002,
                orderProducts: [],
                user: {
                    user_id: 3,
                    nameUser: '',
                    numberPhone: '',
                    address: '',
                    email: ''
                }
            }
            getAll.map(itemTemp => {
                if (itemTemp.order_id == order_id) {
                    order.order_id = itemTemp.order_id,
                        order.user_id = itemTemp.user_id,
                        order.isTemporary = itemTemp.istemporary,
                        order.time_order = itemTemp.time_order,
                        order.orderProducts.push({
                            id: itemTemp.id,
                            order_id: itemTemp.order_id,
                            order_product_id: itemTemp.order_product_id,
                            price: itemTemp.price,
                            quantity: itemTemp.quantity,
                            product: {
                                id: itemTemp.id,
                                name: itemTemp.name,
                                price: itemTemp.price,
                                image: itemTemp.image
                            }
                        })
                    order.user = {
                        user_id: itemTemp.user_id,
                        nameUser: itemTemp.nameUser,
                        numberPhone: itemTemp.numberPhone,
                        address: itemTemp.address,
                        email: itemTemp.email
                    }
                }
            })
            listOrder.push(order)


        })
        let totalPageOrder = Number(countPage.rowCount) % pageSize

        if (totalPageOrder > 0) {
            totalPageOrder = Number(countPage.rowCount) / pageSize + 1
        } else {
            totalPageOrder = Number(countPage.rowCount) / pageSize
        }
        let quantityPage = [];
        for (let i = 1; i <= totalPageOrder; i++) {
            quantityPage.push(i)

        }

        return { listOrder, quantityPage }
    }
    checkout = async (user: BuyUser, order_id: string) => {
        await pool.query(`UPDATE public.buyuser SET "nameUser"='${user.nameUser}', "numberPhone"='${user.numberPhone}', address='${user.address}', email='${user.email}' WHERE user_id=${user.user_id}
        `)
        await pool.query(`UPDATE public.orders SET  istemporary=true WHERE order_id='${order_id}'`)
    }
    order = async (id: string, quantity: number, price: number, user_id: number) => {
        const CheckID = await pool.query(`select order_id  from orders where user_id = ${user_id}  and isTemporary = false`)
        let order_idx = CheckID.rows[0]
        let order_product_id = uuidv4();
        if (order_idx != undefined) {
            pool.query(`      
        DO $$ DECLARE
        BEGIN
        IF (select count(*) from order_product where order_id = '${order_idx.order_id}' and id ='${id}') > 0 then

        UPDATE public.order_product SET  quantity=quantity + ${quantity}  where order_id='${order_idx.order_id}' and id ='${id}';

        else  INSERT INTO public.order_product (order_id, id, quantity, price,order_product_id) VALUES('${order_idx.order_id}', '${id}', ${quantity}, ${price},'${order_product_id}');
        END IF;
        END $$;
        `)

        } else {

            let id_order = uuidv4();

            pool.query(`INSERT INTO public.orders(order_id, user_id, time_order, isTemporary) VALUES('${id_order}', ${user_id}, '1-1-2029', false);`)
            pool.query(`INSERT INTO public.order_product (order_id, id, quantity, price,order_product_id) VALUES('${id_order}', '${id}', ${quantity}, ${price},'${order_product_id}');`)
        }
    }
    listCart = async (user_id: number) => {
        let listCart = await pool.query(`
    select orders.order_id, order_product.order_product_id ,product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
    where user_id = ${user_id} and isTemporary = false`)
        return listCart.rows
    }
    plusQuantity = async (order_product_id: string,user_id:number) => {
        await pool.query(`UPDATE public.order_product
        SET  quantity=quantity + 1 where  order_product_id = '${order_product_id}';
        `)
        let listCart = await pool.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
        where user_id = ${user_id} and isTemporary = false`)
        return listCart.rows
    }
    minusQuantity = async (order_product_id: string,user_id:number) => {
        await pool.query(`UPDATE public.order_product
        SET  quantity=quantity - 1 where  order_product_id = '${order_product_id}';
        `)

        let listCart = await pool.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
        where user_id = ${user_id} and isTemporary = false`)
        return listCart.rows
    }
    deleteCart = async (order_product_id: string,user_id:number) => {
        await pool.query(`DELETE FROM public.order_product
        WHERE  order_product_id='${order_product_id}'
        `)
        let listCart = await pool.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
        where user_id = ${user_id} and isTemporary = false`)
        return listCart.rows
    }
}
export const servicesOrderProduct = new ServicesOrderProduct()