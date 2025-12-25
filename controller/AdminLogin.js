const database = require('../database/db');
const jw = require('./Auth');

const login = async (req, res) => {
    try {
        console.log(req.body);

        const { username, password } = req.body;

        // ✅ basic validation
        if (!username || !password) {
            return res.send({
                status: "Username or password missing",
                statuscode: 400
            });
        }

        const db = await database();
        const collection = db.collection("adminlogin");

        const user = await collection.findOne({ username: username });

        if (user) {
            // ✅ password check (same logic kept)
            if (user.password === password) {

                const token = jw.generateToken({ data: username });

                console.log("Login Successful");

                return res.send({
                    status: "Login Successful",
                    statuscode: 200,
                    token: token,
                    data: user
                });
            } 
            else {
                return res.send({
                    status: "Invalid Credentials",
                    statuscode: 401
                });
            }
        } 
        else {
            return res.send({
                status: "User not found",
                statuscode: 404
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

module.exports = { login };
