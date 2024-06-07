const path = require("path");

const productModel = require("../models/productModel");

const createProduct = async (req, res) => {
  //check incoming data
  console.log(req.body);
  console.log(req.files);

  //Destructing the body data
  const { productName, productPrice, productCategory, productDescription } =
    req.body;

  //validation
  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields",
    });
  }

  // validate if there is image
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Image not found",
    });
  }

  const { productImage } = req.files;

  //upload image
  // 1. generate new image name(abc.png)=>(234444-abc.png)
  const imageName = `${Date.now()}-${productImage.name}`;

  // 2. Make a upload path (/path/upload-directory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  // 3. Move to that directory (await, try-catch)
  try {
    await productImage.mv(imageUploadPath);

    //save to database
    const newProduct = new productModel({
      productName: productName,
      productPrice: productPrice,
      productCategory: productCategory,
      productDescription: productDescription,
      productImage: imageName,
    });
    const product = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error! ",
      error: error,
    });
  }
};

//Fetch all products
const getAllProducts = async (req, res) => {
  //try catch
  try {
    const allProducts = await productModel.find({});
    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
//fetch single  products
const getSingleProduct = async (req, res) => {
  //get product id from url
  const productId = req.params.id;

  //find
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Product fetched !",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
