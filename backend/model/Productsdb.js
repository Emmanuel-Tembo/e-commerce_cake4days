import { pool } from "../config/Db.js"

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
        await pool.query(`DELETE FROM products WHERE product_id = ?;`, [id])
    }
    catch (error) {
        throw error
    }
}

// UPDATED: Create function now includes all fields from your schema.
export const Create = async (name, description, category, price, stock_quantity, image_url,intended_audience, is_on_sale,serves, preparation_time,allergens) => {
    try {
        await pool.query(
            `INSERT INTO products (name, description, category, price, stock_quantity, image_url,intended_audience,is_on_sale,serves,preparation_time,allergens) VALUES (?,?,?,?,?,?,?,?,?,?,?);`, 
            [name, description, category, price, stock_quantity, image_url,intended_audience, is_on_sale,serves,preparation_time,allergens]
        );
    } catch (error) {
        throw error;
    }
}

// UPDATED: Update function now includes all fields and the product ID.
export const Update = async (name, description, category, price, stock_quantity, is_available, image_url, flavour_profile, allergens, serves, preparation_time_days, intended_audience, is_on_sale, id) => {
    try {
        await pool.query(
            `UPDATE products SET name = ?, description = ?, category = ?, price = ?, stock_quantity = ?, is_available = ?, image_url = ?, flavour_profile = ?, allergens = ?, serves = ?, preparation_time_days = ?, intended_audience = ?, is_on_sale = ? WHERE product_id = ?;`,
            [name, description, category, price, stock_quantity, is_available, image_url, flavour_profile, allergens, serves, preparation_time_days, intended_audience, is_on_sale, id]
        );
    } catch (error) {
        throw error;
    }
}
