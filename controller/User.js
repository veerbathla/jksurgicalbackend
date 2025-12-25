
const database = require('../database/db');
const jw=require('./Auth');
const jwt = require('jsonwebtoken');

const showcart = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, 'veerbathla@1234');
        } catch (err) {
            return res.status(401).json({ message: "Invalid token", error: err.message });
        }

        const db = await database();
        const collection = db.collection("user");
        const result = await collection.find().toArray();

        console.log(result);
        res.status(200).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


const { ObjectId } = require("mongodb");

const addtocart = async (req, res) => {
  try {
    const resultnew = jw.verifyToken(req.body.token);
    if (!resultnew.valid) {
      return res.status(401).send({ message: "Invalid Token" });
    }

    const productId = req.body.productId;

    const db = await database();

    // 1️⃣ get product from products/admin collection
    const productCollection = db.collection("admin"); // products
    const product = await productCollection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // 2️⃣ insert into cart
    const cartCollection = db.collection("cart");
    const cartItem = {
      user: resultnew.data,   // user info from token
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };

    await cartCollection.insertOne(cartItem);

    res.send({
      status: "Product added to cart",
      statuscode: 200,
      data: cartItem
    });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};



const removefromcart = async (req, res) => {
    try {
        // Token verify
        const resultnew = jwt.verifyToken(req.body.token);

        if (!resultnew.valid) {
            return res.status(401).send({
                message: "Invalid Token",
                error: resultnew.message
            });
        }

        // get id from params
        const id = req.params.id;

        const db = await database();
        const collection = db.collection("user");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                status: "Data not found",
                statuscode: 404
            });
        }

        res.send({
            status: "data deleted successfully",
            statuscode: 200,
            data: id
        });

        console.log("data deleted successfully");

    } catch (err) {
        res.status(500).send({
            status: "Server Error",
            error: err.message
        });
    }
};

module.exports={addtocart,removefromcart};
