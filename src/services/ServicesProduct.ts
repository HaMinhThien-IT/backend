
import { pool } from "../ConnectDB";

import { Product } from "../model/Product";

class ServicesProduct {
    getListProductWithAdmin = async () => {
        const now = await pool.query('select * from product');
        return now.rows
    }
    getListProductWithPagination = async (page: number, search: string, pageSize: number) => {
        let countProduct;
        let product: Product[] = [];
        if (search != null && search != "") {
            const now = await pool.query(`SELECT * FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
            countProduct = await pool.query(`SELECT count(*) FROM product where name ilike '%${search}%' LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
            product = now.rows
        } else {
            const now = await pool.query(`SELECT * FROM product LIMIT ${pageSize} OFFSET (${page} - 1) * ${pageSize}`)
            countProduct = await pool.query(`SELECT count(*)  FROM product `)
            product = now.rows
        }

        let totalPage = Number(countProduct.rows[0].count) % pageSize;


        if (totalPage > 0) {
            totalPage = (Number(countProduct.rows[0].count) / pageSize) + 1
        } else {
            totalPage = Number(countProduct.rows[0].count) / pageSize
        }
        let arr = [];
        for (let i = 1; i <= totalPage; i++) {
            arr.push(i)
        }
        return { product, arr };
    }
    getProductOnFilter = async (name: string) => {
        const now = await pool.query(`select * from product where lower(name) like  lower('%${name}%') `)
        return now.rows
    }
    addNewProduct = async (image: string, name: string, price: number) => {
        await pool.query('insert into product (image,name,price) values($1,$2,$3)', [image, name, price])
        const now = await pool.query('select * from product');
        return now.rows
    }
    deleteByIdProduct = async (id: string) => {
        await pool.query(`DELETE FROM public.product WHERE id='${id}'`)
        const now = await pool.query('select * from product');
        return now.rows
    }
    editProductById = async (id: string, image: string, name: string, price: number) => {
        pool.query(`UPDATE public.product SET image='${image}', "name"='${name}', price=${price} WHERE id='${id}'`)
        const now = await pool.query('select * from product');
        return now.rows
    }
    
}

export const servicesProduct = new ServicesProduct();