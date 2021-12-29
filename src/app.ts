import e from 'express'
import express, { Request, Response, NextFunction } from 'express'
import { ListProps } from './model/ListProps';
import { Order } from './model/Order';
import { Product, products } from './model/Product'
var bodyParser = require('body-parser');

const app = express()


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')
let dataTemp: Product[] = products;

app.use(cors())
app.delete('/product/:id', (req: Request, res: Response) => {
    let id = String(req.params.id)
    let deleteProduct = dataTemp.filter(item => item.id != id)
    dataTemp = deleteProduct
    console.log(deleteProduct);

    return res.json(deleteProduct)
})


// pagination


app.get('/filter/:name', (req: Request, res: Response) => {
    let name = String(req.params.name)

    let nameFilter = products.filter(item => item.name.includes(name))
    return res.json(nameFilter)
})

app.get('/detail/:id', (req: Request, res: Response) => {
    let id = String(req.params.id)
    let detail;
    products.map((item, index) => item.id == id ? item = detail = products[index] : '')
    return res.json(detail)
})

app.post('/add', (req: Request, res: Response) => {
    let newProduct: Product = {
        id: String(req.body.id),
        image: String(req.body.image),
        name: String(req.body.name),
        price: Number(req.body.price)
    }
    dataTemp.push(newProduct)
    return res.json(dataTemp)
})

app.put('/edit/:id', (req: Request, res: Response) => {

    const id = req.params.id
    const index = dataTemp.findIndex(item => item.id === id)
    if (index === -1) {
        return res.status(404).send('Khong tim thay san pham')
    }
    dataTemp[index] = req.body.product
    return res.json(dataTemp)
})

app.post('/product/filter', (req: Request, res: Response) => {
    const listProps: ListProps = req.body;
    const { page, pageSize, sort, search } = listProps
    if (search !== null) {
        let product = products.filter(item => item.name.includes(search))
        let start = (page - 1) * pageSize
        let end = page * pageSize
        let productPage = product.slice(start, end)

        let totalPage = product.length % pageSize

        console.log("Tong so sp tren trang " + totalPage);
        if (totalPage > 0) {
            totalPage = (product.length / pageSize) + 1

        }else{
            totalPage =(product.length / pageSize) 
        }
        let arr = [];
        for (let i = 0; i < totalPage-1; i++) {
            arr.push(i)
        }
        console.log(arr);
        
        return res.json({productPage,arr})
    } else {
        
        let start = (page - 1) * pageSize
        let end = page * pageSize
        let productPage = dataTemp.slice(start, end)
    
        let totalPage = dataTemp.length % pageSize
    
        console.log("pageSize " + pageSize);
        if (totalPage > 0) {
            totalPage = (dataTemp.length / pageSize) + 1
    
        } else {
    
        }
        let arr = [];
        for (let i = 0; i < totalPage-1; i++) {   
            arr.push(i)
        } 
        return res.json({productPage,arr})
    }

})



app.get('/page/:page', (req: Request, res: Response) => {
    let page = Number(req.params.page) || 1;

    let perPage = 8
    let start = (page - 1) * perPage
    let end = page * perPage
    let productPage = dataTemp.slice(start, end)
    console.log(productPage);

    let totalPage = dataTemp.length % perPage

    console.log(totalPage);
    if (totalPage > 0) {
        totalPage = (dataTemp.length / perPage) + 1

    } else {

    }
    let arr = [];
    for (let i = 1; i < totalPage; i++) {

        arr.push(i)
    }
    console.log(arr);


    return res.status(202).json({ productPage, arr })
})
let order:Order[] =[
    {
        product:{id : '',name:'',price:0,image:'',quantity:0},
        name: '',address:'',email:'',createAt:0,numberPhone:0
    }
]
order = []

app.post('/order/checkout',(req:Request,res:Response)=>{
    let objOrder:Order;
    objOrder = req.body.ItemOrder 
    if(objOrder !== null){
        order.push(objOrder)
    }   
})
app.get('/order/checkout/list',(req:Request,res:Response)=>{
    return res.json(order)
})
app.listen(3000, () => {
    console.log("Port: 3000");
})