import express from 'express'
const router = express.Router();    

import { ProductsCon } from '../controller/ProductsCon.js'


router.get("/getAll",ProductsCon);


export default router