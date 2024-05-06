const Product = require("../models/product");
const port = process.env.PORT;
const asyncWrapper = require("../middleware/asyncWrapper.js");

const getAllProducts = asyncWrapper(async (req, res) => {
  const all_products = await Product.find();
  res.status(200).json(all_products);
});

const getSingleProduct = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ message: "The specified product was not found" });
  }
  res.status(200).json(product);
});

const createProduct = asyncWrapper(async (req, res) => {
  const new_product = await Product.create({
    ...req.body,
    image: `http://localhost:${port}/images/${req.file.filename}`,
  });
  res.status(201).json(new_product);
});

const updateProduct = asyncWrapper(async (req, res) => {
  let product_filename;
  if (req.file) {
    product_filename = req.file.filename;
  } else {
    const existingProduct = await Product.findById(req.params.id);
    if (existingProduct) {
      product_filename = existingProduct.image;
    } else {
      res.status(404).json({ message: "the specified product does not exist" });
    }
  }
  const updated_product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    { ...req.body, image: product_filename },
    {
      new: true,
    }
  );
  res.status(200).json(updated_product);
});

const deleteProduct = asyncWrapper(async (req, res) => {
  const deleted_product = await Product.findByIdAndDelete({
    _id: req.params.id,
  });
  if (!deleted_product) {
    return res
      .status(404)
      .json({ message: "the specified product does not exist" });
  }
  res.status(200).json(deleted_product);
});

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};