const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')

const createUser = async (req, res) => {
  // 1. Check incoming data
  //    console.log(req.body);

  // 2. Destructure the incoming data
  const { firstName, lastName, email, password } = req.body;

  // 3. validation of data (if empty, stop the process and send res)
  if (!firstName || !lastName || !email || !password) {
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
        status: false,
        message: "User Already Exists!",
      });
    }

    // Hashing /Encryption of the password
    const randomSalt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, randomSalt)




    //5.1.1. stop the process
    //5.2 if user is new :
    const newUser = new userModel({
      //Database fields : Client's value
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
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
  // 2. Destructure the incoming data
  const { email, password } = req.body;

  // 3. Validation of data (if empty, stop the process and send response)
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter both email and password!",
    });
  }

  // 4. Error handling (Try Catch)
  try {
    // 5. Verification of user data in the database
    const user = await userModel.findOne({ email: email });

    // 5.1. Check if user exists
    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }
    // 5.2. Compare passwords
    if (password !== user.password) {
      return res.json({
        success: false,
        message: "Incorrect password!",
      });
    }
    // 5.3. If user found and password matched, send success response
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Exporting
module.exports = {
  createUser,
  loginUser,
};
