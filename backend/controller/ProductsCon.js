import {getProducts} from '../model/Productsdb.js'

export const ProductsCon = async(req,res)=>{
    res.json({
        data:await getProducts()
    })
    
}
