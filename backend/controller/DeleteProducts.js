import {DeleteProducts} from '../model/deletedb.js'

export const ProductsCon = async(req,res)=>{
    res.json({
        data:await DeleteProducts()
    })
    
}