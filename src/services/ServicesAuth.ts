// import express, { NextFunction, Request, response, Response } from 'express'
// import { pool } from '../ConnectDB'
// const jwt = require("jsonwebtoken")
// class ServicesAuth{
//     login = async (email:string,password:string) => {
//         let userBuyer = await pool.query(`select user_id from buyuser b where email ='${email}' and "password" ='${password}' `)
//         await pool.end()
//         if (userBuyer.rows[0] != undefined) {
//             const accSessToken = jwt.sign(userBuyer.rows[0], process.env.ACCESS_TOKEN_SECRET, { expiresIn: '180s' })
//             res.header('jwt', accSessToken).send(accSessToken)
//         } else {
//             const response = {
//                 status: 404
//             }
//             return res.status(404).json(response)
//         }
//     }
// }
// export const servicesAuth = new ServicesAuth()