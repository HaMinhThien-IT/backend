
import express, { NextFunction, Request, Response } from 'express'
const { Client } = require('pg');
import { ListProps } from './model/ListProps';
import { Cart } from './model/Cart';
// import { Order } from './model/Order';
import { Product } from './model/Product'
import { v4 as uuidv4 } from 'uuid';
import { OrderProps, PageOrder } from './model/CartProps';
import { OrderWithDetail } from './model/Order';
import { DatabaseError, QueryResult } from 'pg'
import { BuyUser, PropsLogin } from './model/BuyUser';
var bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
import dotenv from 'dotenv'
import router from './routers/Routers';
dotenv.config();
const app = express()



app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')

app.use(cors())

app.use(router)
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




app.get('/detail/:id', async (req: Request, res: Response) => {
    let id = String(req.params.id)
    const listProduct: Product[] = await products()
    let detail;
    listProduct.map((item, index) => item.id == id ? item = detail = listProduct
    [index] : '')
    console.log(detail);
    return res.json(detail)
})




app.post('/login', async (req: Request, res: Response) => {
    const loginProps: PropsLogin = req.body;
    const { email, password } = loginProps
    const client = new Client(credentials);
    await client.connect();
   
})


app.listen(3000, () => {
    console.log("Port: 3000");
})