const userModel = require("../models/userModel");

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
    //5.1.1. stop the process
    //5.2 if user is new :
    const newUser = new userModel({
        //Database fields : Client's value
        firstName : firstName,
        lastName : lastName,
        email :email,
        password : password
    })
    // 5.2.1  Hash the password
    //5.2.2 save to the database
    await newUser.save()

    //5.2.3 send confirmation response
    res.json({
        "success ": true,
        "message" : "User created successfully"
    })

  } catch (error) {
    console.log(error)
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

//

// Exporting
module.exports = {
  createUser,
};
