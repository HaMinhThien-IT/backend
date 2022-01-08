import { NextFunction, Request, Response, Router } from 'express';
import { authController } from '../controller/AuthController';
import { orderProductController } from '../controller/OrderProductController';
import { productController } from './../controller/ProductController';
const jwt = require("jsonwebtoken")

const router = Router()
function authenToken(req: Request, res: Response, netx: NextFunction) {
    const authorizationHeader = req.header('authorization')
    if (!authorizationHeader) return res.status(401).send("Ban chua dang nhap")
    try {
        jwt.verify(authorizationHeader, process.env.ACCESS_TOKEN_SECRET)    
        netx()
    } catch (error) {
        return res.status(401).send("login that bai")
    }
}
//product
router.get('/admin',authenToken, productController.getListProductWithAdmin)
router.post('/product/filter',authenToken, productController.getListProductWithPagination)
router.post('/filter/:name', productController.getProductOnFilter)
router.post('/add', productController.addNewProduct)
router.delete('/product/:id',productController.deleteWithProduct)
router.put('/edit/:id',productController.editProductById)


//order
router.post('/getListOrder/:user_id',orderProductController.getListOrder)
router.post('/checkout',orderProductController.checkout)
router.post('/order/:id',orderProductController.order)
router.post('/listCart',orderProductController.listCart)
router.post('/plus',orderProductController.plusQuantity)
router.post('/minus',orderProductController.minusQuantity)
router.post('/delete',orderProductController.deleteCart)



// auth
router.get('/getMe',authController.getInfoMe)
export default router