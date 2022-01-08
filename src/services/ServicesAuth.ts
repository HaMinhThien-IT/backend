import express, { NextFunction, Request, response, Response } from 'express'
import { pool } from '../ConnectDB'
const jwt = require("jsonwebtoken")
class ServicesAuth {
    getInfoMe = async (user_id:number) => {
      let infoMe = await pool.query(`select "nameUser", email from buyuser b  where  user_id = ${user_id}`)
       return infoMe.rows[0]
    }
}
export const servicesAuth = new ServicesAuth()