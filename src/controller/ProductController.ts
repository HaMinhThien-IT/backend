import express, { NextFunction, Request, response, Response } from 'express'
import { ListProps } from '../model/ListProps'
import { servicesProduct } from "../services/ServicesProduct"


class ProductController {

    getListProductWithAdmin = async (req: Request, res: Response) => {
        res.json(await servicesProduct.getListProductWithAdmin())
    }
    getListProductWithPagination = async (req: Request, res: Response) => {
        const listProps: ListProps = req.body;
        const { page, search,pageSize, } = listProps
        res.json(await servicesProduct.getListProductWithPagination(page,search,pageSize))
    }
    getProductOnFilter = async(req: Request, res: Response)=>{
        res.json(await servicesProduct.getProductOnFilter(String(req.params.name)))
    }
    addNewProduct = async(req: Request, res: Response) =>{
        const { image, name, price } = req.body
        res.json(await servicesProduct.addNewProduct(image, name, price))
    }
    deleteWithProduct = async(req:Request,res:Response) =>{
        let id = String(req.params.id)
        res.json(await servicesProduct.deleteByIdProduct(id))
    }
    editProductById = async (req:Request,res:Response) =>{
        const id = String(req.params.id)
        const { image, name, price } = req.body
        res.json(await servicesProduct.editProductById(id, image, name, price ))
    }
    
}

export const productController = new ProductController()

