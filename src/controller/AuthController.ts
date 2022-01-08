import { servicesAuth } from './../services/ServicesAuth';
const jwt = require("jsonwebtoken")
import express, { NextFunction, Request, Response } from 'express'
class AuthController {

    getInfoMe = async (req: Request, res: Response, netx: NextFunction) => {
      
        const authorizationHeader = req.header('authorization')
      //  if (!authorizationHeader) return res.status(401).send("Ban chua dang nhap")
        try {
            let  test = jwt.verify(authorizationHeader, process.env.ACCESS_TOKEN_SECRET)           
            res.json(await servicesAuth.getInfoMe(Number(test.user_id)))
        } catch (error) {
            // return res.status(401).send("login that bai")
        }
       
    }
}
export const authController = new AuthController()