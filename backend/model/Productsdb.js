import { pool } from "../config/db.js"

export const getProducts = async () => {
  try {
    let [rows] = await pool.query(`SELECT * FROM products`)
    return rows
  } catch (error) {
    return error
  }
}

// New function to get products by intended_audience
export const getProductsByAudience = async (audience) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT
                p.*,
                COALESCE(AVG(pr.rating), 0) AS average_rating,
                COUNT(pr.review_id) AS total_reviews
            FROM
                products p
            LEFT JOIN
                product_reviews pr ON p.product_id = pr.product_id
            WHERE
                p.intended_audience = ?
            GROUP BY
                p.product_id;
            `,
            [audience]
        );
        return rows;
    } catch (error) {
        console.error("Error fetching products by audience:", error);
        throw error;
    }
};

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
