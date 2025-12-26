const database = require('../database/db');

const register = async (req, res) => {
    try {
        console.log(req.body);

        const { username, password } = req.body;

        // ✅ basic validation
        if (!username || !password) {
            return res.send({
                status: "Required fields missing",
                statuscode: 400
            });
        }

        const db = await database();
        const collection = db.collection("userlogin");

        // ✅ check if user already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.send({
                status: "User already exists",
                statuscode: 409
            });
        }

        // ✅ insert user
        const user = await collection.insertOne(req.body);

        if (user.acknowledged === true) {
            return res.send({
                status: "Registration Successful",
                statuscode: 200,
                data: user
            });
        } else {
            return res.send({
                status: "Registration failed",
                statuscode: 400
            });
        }

    } catch (err) {
        console.error(err);
        return res.send({
            status: "Server Error",
            statuscode: 500,
            error: err.message
        });
    }
};

module.exports = { register };
