import {InsertProducts} from '../model/createdb.js'

export const ProductsCon = async(req,res)=>{
    res.json({
        data:await InsertProducts()
    })
    
}