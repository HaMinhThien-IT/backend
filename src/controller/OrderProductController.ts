import express, { NextFunction, Request, response, Response } from 'express'
import { BuyUser } from '../model/BuyUser'
import { OrderProps } from '../model/CartProps'
import { servicesOrderProduct } from '../services/ServicesOrderProduct'
class OrderProductController {
    getListOrder = async (req: Request, res: Response) => {

        res.json(await servicesOrderProduct.getListOrder(Number(req.params.user_id), Number(req.body.pageSize), Number(req.body.page)))
    }
    checkout = async (req: Request, res: Response) => {
        let user: BuyUser = req.body.user
        res.json(await servicesOrderProduct.checkout(user, req.body.order_id))
    }
    order = async (req: Request, res: Response) => {
        const orderProps: OrderProps = req.body;
        const { price, quantity, user_id } = orderProps
        res.json(await servicesOrderProduct.order(String(req.params.id), quantity, price, user_id))
    }
    listCart = async (req: Request, res: Response) => {
        const orderProps: OrderProps = req.body;
        const { user_id } = orderProps
        res.json(await servicesOrderProduct.listCart(user_id))
    }
    plusQuantity = async (req: Request, res: Response) => {
        const orderProps: OrderProps = req.body;
        const { order_product_id } = orderProps
        res.json(await servicesOrderProduct.plusQuantity(order_product_id))
    }
   minusQuantity = async (req: Request, res: Response) => {
        const orderProps: OrderProps = req.body;
        const { order_product_id } = orderProps
        res.json(await servicesOrderProduct.minusQuantity(order_product_id))
    }
    deleteCart = async (req: Request, res: Response) => {
        const orderProps: OrderProps = req.body;
        const { order_product_id } = orderProps
        res.json(await servicesOrderProduct.deleteCart(order_product_id))
    }
}
export const orderProductController = new OrderProductController()