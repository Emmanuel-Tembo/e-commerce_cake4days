import { pool } from "../config/db.js"

export const UpdateProducts = async () => {
  try {
    let [rows] = await pool.query(`UPDATE * FROM products`)
    return rows
  } catch (error) {
    return error
  }
}
