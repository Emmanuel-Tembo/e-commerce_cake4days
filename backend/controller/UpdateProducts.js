import {UpdateProducts} from '../model/updatedb.js'

export const ProductsCon = async(req,res)=>{
    res.json({
        data:await UpdateProducts()
    })
    
}