import express from 'express'
const router = express.Router();    

import * as products from '../controller/ProductsCon.js';

router.get('/products', products.ProductsCon);


export default router;