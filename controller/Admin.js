const database = require('../database/db');
const auth = require('./Auth');               // custom auth
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

/* =======================
   GET PRODUCT LIST
   ======================= */
const getproductList = async (req, res) => {
    try {
        const db = await database();
        const collection = db.collection("admin");

        const result = await collection.find().toArray();

        console.log(result);
        res.status(200).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = { getproductList };

/* =======================
   INSERT PRODUCT
   ======================= */
const insertproduct = async (req, res) => {
    try {
        const resultnew = auth.verifyToken(req.body.token);

        if (!resultnew.valid) {
            return res.status(401).send({
                message: "Invalid Token",
                error: resultnew.message
            });
        }

        console.log(req.body);

        const db = await database();
        const collection = db.collection("admin");

        const result = await collection.insertOne(req.body);

        if (result.acknowledged === true) {
            res.send({
                status: "Data inserted successfully....",
                statuscode: 200,
                data: result
            });
        } else {
            res.send({
                status: "oops some issue occur, please try again....",
                statuscode: 400,
            });
        }

    } catch (err) {
        res.status(500).send(err);
    }
};

/* =======================
   DELETE PRODUCT
   ======================= */
const deleteproduct = async (req, res) => {
    try {
        // ✅ Token verify (CUSTOM AUTH)
        const resultnew = auth.verifyToken(req.body.token);

        if (!resultnew.valid) {
            return res.status(401).send({
                message: "Invalid Token",
                error: resultnew.message
            });
        }

        // ✅ get id from params
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({
                message: "Product ID is required"
            });
        }

        const db = await database();
        const collection = db.collection("admin");

        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.status(200).send({
            message: "Product deleted successfully",
            deletedId: id
        });

    } catch (err) {
        res.status(500).send({
            message: "Server Error",
            error: err.message
        });
    }
};
/* =======================
   UPDATE PRODUCT
   ======================= */
const updateproduct = async (req, res) => {
    try {
        const resultnew = auth.verifyToken(req.body.token);

        if (!resultnew.valid) {
            return res.status(401).send({
                message: "Invalid Token",
                error: resultnew.message
            });
        }

        const id = req.params.id;
        const db = await database();
        const collection = db.collection("admin");

        // token ko update hone se roka
        const { token, ...updateData } = req.body;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        res.send({
            status: "data updated successfully",
            statuscode: 200,
            data: id
        });

        console.log("data updated successfully");

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getproductList,
    insertproduct,
    updateproduct,
    deleteproduct
};
