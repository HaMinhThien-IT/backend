
import express, { Request, Response } from 'express'
const { Client } = require('pg');
import { ListProps } from './model/ListProps';
import { Cart } from './model/Cart';
// import { Order } from './model/Order';
import { Product } from './model/Product'
import { v4 as uuidv4 } from 'uuid';
import { OrderProps } from './model/CartProps';
import { OrderWithDetail } from './model/Order';
import {QueryResult} from 'pg'
var bodyParser = require('body-parser');

const app = express()


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')

app.use(cors())


const credentials = {
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "200222",
    database: "postgres"
};
async function products() {
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query('select * from product ');
    await client.end();
    return now.rows;
}

async function listCart() {
    const client = new Client(credentials);
    await client.connect();
    const listCart = await client.query('select product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id ');
    await client.end();
    return listCart.rows;
}




// pagination


app.get('/filter/:name', async (req: Request, res: Response) => {
    let name = String(req.params.name)
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query(`select * from product where lower(name) like  lower('%${name}%') `)
    return res.json(now.rows);
})

app.get('/detail/:id', async (req: Request, res: Response) => {
    let id = String(req.params.id)
    const listProduct: Product[] = await products()
    let detail;
    listProduct.map((item, index) => item.id == id ? item = detail = listProduct
    [index] : '')
    console.log(detail);
    return res.json(detail)
})

app.post('/add', async (req: Request, res: Response) => {

    const { image, name, price } = req.body

    const client = new Client(credentials);
    await client.connect();
    await client.query('insert into product (image,name,price) values($1,$2,$3)', [image, name, price])
    const listProduct: Product[] = await products()
    return res.json(
        listProduct
    );

})

app.put('/edit/:id', async (req: Request, res: Response) => {

    const id = String(req.params.id)
    const { image, name, price } = req.body


    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public.product SET image='${image}', "name"='${name}', price=${price} WHERE id='${id}'`)
    const listProduct: Product[] = await products()
    return res.json(
        listProduct
    );

})

app.delete('/product/:id', async (req: Request, res: Response) => {
    let id = Number(req.params.id)
    const client = new Client(credentials);
    await client.connect();
    await client.query(`DELETE FROM public.product WHERE id=${id}`)
    const listProduct: Product[] = await products()
    return res.json(listProduct)
})

app.post('/product/filter', async (req: Request, res: Response) => {

    const listProps: ListProps = req.body;
    const { page, pageSize, sort, search } = listProps
    const client = new Client(credentials);
    await client.connect();
    let countProduct;
    let product: Product[] = [];
    if (search != null && search != "") {
        const now = await client.query(`SELECT * FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
        countProduct = await client.query(`SELECT count(*) FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
        product = now.rows
    } else {
        const now = await client.query(`SELECT * FROM product LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
        countProduct = await client.query(`SELECT count(*)  FROM product `)
        product = now.rows

    }

    let totalPage = Number(countProduct.rows[0].count) % pageSize;


    if (totalPage > 0) {
        totalPage = (Number(countProduct.rows[0].count) / pageSize) + 1
    } else {
        totalPage = Number(countProduct.rows[0].count) / pageSize
    }
    let arr = [];
    for (let i = 0; i < totalPage - 1; i++) {
        arr.push(i)
    }

    return res.json({ product, arr });
})



app.get('/admin', async (req: Request, res: Response) => {
    const listProduct: Product[] = await products()
    return res.json(listProduct)
})
// let order: Order[] = [
//     {
//         product: { id: '', name: '', price: 0, image: '', quantity: 0 },
//         name: '', address: '', email: '', createAt: 0, numberPhone: 0
//     }
// ]
// order = []

// app.post('/order/checkout', (req: Request, res: Response) => {
//     let objOrder: Order;
//     objOrder = req.body.ItemOrder
//     if (objOrder !== null) {
//         order.push(objOrder)
//     }
// })
// app.get('/order/checkout/list', (req: Request, res: Response) => {
//     return res.json(order)
// })
app.get('/test', (req: Request, res: Response) => {
    console.log(products);
})
// false chua thanh toan  , true da thanh toan
app.post('/order/:id', (async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();

    const orderProps: OrderProps = req.body;
    const { price, quantity,user_id } = orderProps
    console.log(price, quantity);

    const CheckID = await client.query(`select order_id  from orders where user_id = ${user_id}  and isTemporary = false`)
    let order_idx = CheckID.rows[0]
    let order_product_id = uuidv4();
    if (order_idx != undefined) {
        client.query(`      
        DO $$ DECLARE
        BEGIN
        IF (select count(*) from order_product where order_id = '${order_idx.order_id}' and id ='${req.params.id}') > 0 then

        UPDATE public.order_product SET  quantity=quantity + ${quantity}  where order_id='${order_idx.order_id}' and id ='${req.params.id}';

        else  INSERT INTO public.order_product (order_id, id, quantity, price,order_product_id) VALUES('${order_idx.order_id}', '${req.params.id}', ${quantity}, ${price},'${order_product_id}');
        END IF;
        END $$;
        `)

    } else {

        let id_order = uuidv4();

        client.query(`INSERT INTO public.orders(order_id, user_id, time_order, isTemporary) VALUES('${id_order}', 3, '1-1-2029', false);`)
        client.query(`INSERT INTO public.order_product (order_id, id, quantity, price,order_product_id) VALUES('${id_order}', '${req.params.id}', ${quantity}, ${price},'${order_product_id}');`)
    }
}))

app.post('/listCart', (async (req: Request, res: Response) => {
    const orderProps: OrderProps = req.body;
    const { user_id } = orderProps
    console.log(req.body.user_id);
    
    const client = new Client(credentials);
    await client.connect();
    let listCart = await client.query(`
    select order_product.order_product_id ,product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
    where user_id = ${user_id} and isTemporary = false`)
    return res.json(listCart.rows)
}))

app.post('/plus', (async (req: Request, res: Response) => {
    const orderProps: OrderProps = req.body;
    const { order_product_id } = orderProps
    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public.order_product
    SET  quantity=quantity + 1 where  order_product_id = '${order_product_id}';
    `)
    let listCart = await client.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
    where user_id = 3 and isTemporary = false`)
    return res.json(listCart.rows)
}))

app.post('/minus', (async (req: Request, res: Response) => {
    const orderProps: OrderProps = req.body;
    const { order_product_id } = orderProps
    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public.order_product
    SET  quantity=quantity - 1 where  order_product_id = '${order_product_id}';
    `)
    console.log(`UPDATE public.order_product
        SET  quantity=quantity + 1 where  order_product_id = '${order_product_id}';
        `);

    let listCart = await client.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
    where user_id = 3 and isTemporary = false`)
    return res.json(listCart.rows)
}))

app.post('/delete', (async (req: Request, res: Response) => {
    const orderProps: OrderProps = req.body;
    const { order_product_id } = orderProps
    const client = new Client(credentials);
    await client.connect();
    await client.query(`DELETE FROM public.order_product
    WHERE  order_product_id='${order_product_id}'
    `)
    let listCart = await client.query(`select order_product.order_product_id, product.image, product."name" ,order_product.price ,order_product.quantity from order_product  join product on product.id = order_product.id join orders on orders.order_id = order_product.order_id 
    where user_id = 3 and isTemporary = false`)
    return res.json(listCart.rows)
}))

app.get('/getListOrder/:user_id', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    let listOrderUser:QueryResult = await client.query(`select * from order_product join orders on order_product.order_id  = orders.order_id join product on product.id  = order_product.id  join buyuser  on buyuser.user_id  = orders.user_id where buyuser.user_id = ${req.params.user_id} and isTemporary = true
    `)
    let getAll = listOrderUser.rows
    
    let listOrder:OrderWithDetail[] =[] 
    let allId:string[] = []
    getAll.map(item=>allId.push(item.order_id))
    allId=Array.from(new Set(allId))
    console.log(allId);
    allId.map(order_id=>{
        const order:OrderWithDetail  ={
            order_id : order_id,
            user_id : Number(req.params.user_id),
            isTemporary : true,
            time_order : 2-2-2002,
            orderProducts : [],
            user :{
                user_id : 3,
                nameUser : '',
                numberPhone : '',
                address : '',
                email : ''
            }
        }
        getAll.map(itemTemp=>{
            if(itemTemp.order_id == order_id){

                
                order.order_id = itemTemp.order_id,
                order.user_id = itemTemp.user_id ,
                order.isTemporary = itemTemp.istemporary,
                order.time_order = itemTemp.time_order,
                order.orderProducts.push({
                    id: itemTemp.id,
                    order_id : itemTemp.order_id,
                    order_product_id : itemTemp.order_product_id,
                    price : itemTemp.price,
                    quantity : itemTemp.quantity,
                    product :{
                        id:itemTemp.id,
                        name:itemTemp.name,
                        price:itemTemp.price,
                        image:itemTemp.image
                    }
                })
               order.user = {
                   user_id:itemTemp.user_id,
                   nameUser:itemTemp.nameUser,
                   numberPhone:itemTemp.numberPhone,
                   address:itemTemp.address,
                   email:itemTemp.email
               }
            }
        })
        listOrder.push(order)
       
        
    })
    return res.json(listOrder)
})

app.listen(3000, () => {
    console.log("Port: 3000");
})