const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../service/sendOtp");

const createUser = async (req, res) => {
  // 1. Check incoming data
  //    console.log(req.body);

  // 2. Destructure the incoming data
  const { firstName, lastName, email, password, phone } = req.body;

  // 3. validation of data (if empty, stop the process and send res)
  if (!firstName || !lastName || !email || !password ||!phone) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: "Please enter all fields !",
    });
  }

  // 4. Error handling( Try Catch)
  try {
    // 5. Check if the user is already register
    const existingUser = await userModel.findOne({ email: email });

    // 5.1. if user found : Send response
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists!",
      });
    }

    // Hashing /Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    //5.1.1. stop the process
    //5.2 if user is new :
    const newUser = new userModel({
      //Database fields : Client's value
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    // 5.2.1  Hash the password
    //5.2.2 save to the database
    await newUser.save();

    //5.2.3 send confirmation response
    res.json({
      "success ": true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error !",
    });
  }
};

//Write a logic for login
// 1. Check incoming data
// 2. Destructure the incoming data
// 3. validation of data
// 4. Error handling( Try Catch)
// 5. verification of user data in database:

const loginUser = async (req, res) => {
  // res.send("Login API is working");

  // check incoming data
  console.log(req.body);

  // 2. Destructure the incoming data
  const { email, password } = req.body;

  // 3. validation
  if (!email || !password) {
    return res.json({
      success: false,
      message: "please enter all fields!",
    });
  }
  //4. try catch
  try {
    //find user(email)
    const user = await userModel.findOne({ email: email });

    //found data: firstname , lastname, password, email

    //not found(error messgae)
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exists!",
      });
    }

    //compare password(bcrypt)
    const isValidPassword = await bcrypt.compare(password, user.password);

    //not valid password(error)
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Password not matched!",
      });
    }

    // token (generate with user data + key)
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    //response (token, user data)
    res.json({
      success: true,
      message: "User Loggedin successfully",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

//forgot password by using phone number

const forgotPassword = async (req,res)=>{
  console.log(req.body)
  const {phone} = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Provide your Phone number",
    })
    
  }
  try {
    //finding user
    const user = await userModel.findOne({phone:phone});
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
      
    }
    // generate random 6 digit  OTP
    const otp = Math.floor(100000 + Math.random()* 900000)

    // generate expiry date
    const expiryDate = Date.now()+360000;

    // save to database for verification
    user.resetPasswordOTP =otp;
    user.resetPasswordExpires = expiryDate;
    await user.save();

    // send to register phone number
    const isSent= await sendOtp(phone,otp);
    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: "Error sending otp code!",
      });
    }
    // if success
    res.status(200).json({
      success: true,
      message: "OTP SEnd Successfully",
    });
    
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }

}

// Exporting
module.exports = {
  createUser,
  loginUser,
  forgotPassword,
};
