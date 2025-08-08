import { pool } from "../config/db.js"

export const DeleteProducts = async () => {
  try {
    let [rows] = await pool.query(`DELETE FROM products`)
    return rows
  } catch (error) {
    return error
  }
}
