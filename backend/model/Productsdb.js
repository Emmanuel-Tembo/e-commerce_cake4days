import { pool } from "../config/db.js"

export const getProducts = async () => {
  try {
    let [rows] = await pool.query(`SELECT * FROM products`)
    return rows
  } catch (error) {
    return error
  }
}
