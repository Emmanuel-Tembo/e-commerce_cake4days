import express from 'express'
const router = express.Router();    


import {ProductsCon}from '../controller/ProductsCon.js';
import { DeleteCon } from '../controller/ProductsCon.js';
import { CreateCon } from '../controller/ProductsCon.js';
import { UpdateCon } from '../controller/ProductsCon.js';


router.get('/getAll', ProductsCon);
router.delete('/Delete/:id', DeleteCon)
router.post('/Create', CreateCon)
router.patch('/Update/:id', UpdateCon)

export default router;