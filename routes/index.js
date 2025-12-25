const express = require('express');
const router = express.Router();

const adminController = require('../controller/Admin');
const adminLogin = require('../controller/AdminLogin');
const adminRegister = require('../controller/AdminRegister');

const userController = require('../controller/User');
const userLogin = require('../controller/UserLogin');
const userRegister = require('../controller/UserRegister');

router.use(express.json());

/* =======================
   ADMIN AUTH
   ======================= */
router.post('/admin/register', adminRegister.register);
router.post('/admin/login', adminLogin.login);

/* =======================
   ADMIN PRODUCT APIs
   ======================= */
router.post('/admin/products', adminController.insertproduct);
router.post('/admin/products/list', adminController.getproductList);
router.put('/admin/products/:id', adminController.updateproduct);
router.delete('/admin/products/:id', adminController.deleteproduct);

/* =======================
   USER AUTH
   ======================= */
router.post('/user/register', userRegister.register);
router.post('/user/login', userLogin.login);

/* =======================
   USER PRODUCT APIs
   ======================= */
   router.post('/user/products/list', userController.getproductList);
router.post('/user/cart', userController.addtocart);
router.delete('/user/cart/:id', userController.removefromcart);

module.exports = router;
