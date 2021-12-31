
import express, { Request, Response } from 'express'
const { Client } = require('pg');
import { ListProps } from './model/ListProps';
import { Order } from './model/Order';
import { Product } from './model/Product'
var bodyParser = require('body-parser');

const app = express()


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')
let dataTemp: Product[];

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
    let product: Product[]=[];
    if (search != null && search != "") {
        const now = await client.query(`SELECT * FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
        countProduct = await client.query(`SELECT count(*) FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`) 
        product = now.rows       
    }else{      
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
    
   return res.json({ product, arr});





    // return res.json({now,rows,arr});
    // const listProduct: Product[] = await products()
    // if (search !== null) {
    //     let product = listProduct.filter(item => item.name.includes(search))
    //     let start = (page - 1) * pageSize
    //     let end = page * pageSize
    //     let productPage = product.slice(start, end)

    //     let totalPage = product.length % pageSize
    //     if (totalPage > 0) {
    //         totalPage = (product.length / pageSize) + 1

    //     } else {
    //         totalPage = (product.length / pageSize)
    //     }
    //     let arr = [];
    //     for (let i = 0; i < totalPage - 1; i++) {
    //         arr.push(i)
    //     }
    //     console.log(arr);

    //     return res.json({ productPage, arr })
    // } else {

    //     let start = (page - 1) * pageSize
    //     let end = page * pageSize
    //     let productPage = listProduct.slice(start, end)

    //     let totalPage = listProduct.length % pageSize
    //     if (totalPage > 0) {
    //         totalPage = (listProduct.length / pageSize) + 1

    //     } else {

    //     }
    //     let arr = [];
    //     for (let i = 0; i < totalPage - 1; i++) {
    //         arr.push(i)
    //     }
    //     return res.json({ productPage, arr })
    // }


})



app.get('/admin', async (req: Request, res: Response) => {
    const listProduct: Product[] = await products()
    return res.json(listProduct)
})
let order: Order[] = [
    {
        product: { id: '', name: '', price: 0, image: '', quantity: 0 },
        name: '', address: '', email: '', createAt: 0, numberPhone: 0
    }
]
order = []

app.post('/order/checkout', (req: Request, res: Response) => {
    let objOrder: Order;
    objOrder = req.body.ItemOrder
    if (objOrder !== null) {
        order.push(objOrder)
    }
})
app.get('/order/checkout/list', (req: Request, res: Response) => {
    return res.json(order)
})
// sql

app.get('/test', (req: Request, res: Response) => {
    console.log(products);
})
app.listen(3000, () => {
    console.log("Port: 3000");
})