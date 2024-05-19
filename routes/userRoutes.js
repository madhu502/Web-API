const router = require("express").Router();
const userController = require('../controllers/userControllers')

// Creating user registration route
router.post('/create', userController.createUser)

// login routes
router.post('/login',userController.loginUser)

// Controller(Export)-> Routes (import)-> use ->(index.js)

//Exporting the routes
  module.exports = router