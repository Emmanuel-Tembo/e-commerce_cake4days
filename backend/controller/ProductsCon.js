import {getProducts} from '../model/Productsdb.js'
import { Delete } from '../model/Productsdb.js'
import { Create } from '../model/Productsdb.js'
import { Update } from '../model/Productsdb.js'

export const ProductsCon = async(req,res)=>{
    res.json({
        data:await getProducts()
    })
    
}

export const DeleteCon = async(req,res)=> {
    try {
        const {id} = req.params;
        await Delete(id);
        res.json({message:'Product Deleted successfully'})

    } catch (error) {
        return error
    }
}

export const CreateCon = async (req,res) => {
  let {name,description,category,price,stock_quantity,intended_audience} = req.body
  await Create(name,description,category,price,stock_quantity,intended_audience)
  res.json({
    message: 'Product added successfully'
  })
} 

export const UpdateCon = async (req,res) => {
    let {id} = req.params;
    let {name,description,category,price,stock_quantity,intended_audience} = req.body;
    await Update(name,description,category,price,stock_quantity,intended_audience,id)
    res.json({
        message: 'Product updated successfully'
    })
}