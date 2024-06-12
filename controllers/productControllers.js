const path = require("path");

const productModel = require("../models/productModel");
const fs = require("fs"); //filesystem

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

//update product
//1. get product id (URL)
//2. if image :
//3.new image should be upload
//4. Old image should be delete
//5. find product (database) productImage
//6. find that image in directory
//7. delete that image
//8. update that product

const updateProduct = async (req, res) => {
  try {
    //if there is image
    if (req.files && req.files.productImage) {
      // destructing
      const { productImage } = req.files;

      //upload image to /public/products folder
      // 1. generate new image name(abc.png)=>(234444-abc.png)
      const imageName = `${Date.now()}-${productImage.name}`;

      // 2. Make a upload path (/path/upload-directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      //move to folder
      await productImage.mv(imageUploadPath);

      //req.params(uid), req.body(updated data = pn,pp,pc,pd), req.files(image)
      //add new field to req.body (productImage -> name)
      req.body.productImage = imageName; // image uploaded (generated name)

      // if image is uploaded and req.body is assigned
      if (req.body.productImage) {
        //find existing product by id
        const existingProduct = await productModel.findById(req.params.id);
        if (!existingProduct) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
        //searching in the directory
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );

        //delete from file system
        fs.unlinkSync(oldImagePath);
      }
    }
    //update product data
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
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
  updateProduct,
};
