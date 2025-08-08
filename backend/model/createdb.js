import { pool } from "../config/db.js"

export const InsertProducts = async () => {
  try {
    let [rows] = await pool.query(`INSERT INTO * FROM products`)
    return rows
  } catch (error) {
    return error
  }
}
