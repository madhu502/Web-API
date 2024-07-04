const router = require("express").Router();
const userController = require("../controllers/userControllers");

// Creating user registration route
router.post("/create", userController.createUser);

// login routes
router.post("/login", userController.loginUser);

//forgotpassword routes
router.post("/forgot_password", userController.forgotPassword);

//verify otp and set password
router.post("/verify_otp", userController.verifyOtpAndSetPassword);

// Controller(Export)-> Routes (import)-> use ->(index.js)

//Exporting the routes
module.exports = router;
