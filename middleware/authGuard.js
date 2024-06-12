const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  // check incoming data
  console.log(req.headers); //pass

  //get authorization data from headers
  const authHeader = req.headers.authorization;

  //check or validate
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Auth header not found",
    });
  }
  //split the data (Format : 'Bearer token-sdfg') - only token
  const token = authHeader.split(" ")[1];

  // if token not found : stop the process(res)
  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }

  //verify
  try {
    const decodeUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeUserData;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Not Authenticated!",
    });
  }
  // if verified :next (function in controller)

  //not verified :not authorize
};

//Admin Guard
const adminGuard = (req, res, next) => {
  // check incoming data
  console.log(req.headers); //pass

  //get authorization data from headers
  const authHeader = req.headers.authorization;

  //check or validate
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Auth header not found",
    });
  }
  //split the data (Format : 'Bearer token-sdfg') - only token
  const token = authHeader.split(" ")[1];

  // if token not found : stop the process(res)
  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }

  //verify
  try {
    const decodeUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeUserData; //id, isAdmin
    if (!req.user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Permission Denied!",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Not Authenticated!",
    });
  }
  // if verified :next (function in controller)

  //not verified :not authorize
};
module.exports = {
  authGuard,
  adminGuard,
};
