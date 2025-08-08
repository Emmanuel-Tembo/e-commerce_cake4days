import { pool } from "../config/db.js"

export const getProducts = async () => {
  try {
    let [rows] = await pool.query(`SELECT * FROM products`)
    return rows
  } catch (error) {
    return error
  }
}

export const Delete = async (id) => {
  try {
    await pool.query(`DELETE FROM products WHERE product_id = ?;`,[id])
  } catch (error) {
    throw error
  }
} 

export const Create = async (name,description,category,price,stock_quantity,intended_audience)=>{
  try {
    await pool.query(`INSERT INTO products (name,description,category,price,stock_quantity,intended_audience) VALUES (?,?,?,?,?,?);`,[name,description,category,price,stock_quantity,intended_audience])
  } catch (error) {
    throw error
  }
}

export const Update = async(name,description,category,price,stock_quantity,intended_audience,id)=>{
  try {
    await pool.query(`UPDATE products SET name = ?,description = ?,category = ?,price = ?,stock_quantity = ?,intended_audience = ? WHERE product_id =?;`,[name,description,category,price,stock_quantity,intended_audience,id])
  } catch (error) {
    throw error
  }
}