const { MongoClient } = require('mongodb');
const url="mongodb+srv://veerbathla0676:Veer0620@veer.tqxhfcs.mongodb.net/";
const client=new MongoClient(url);
let db;
async function main()
{
    try
    {
        await client.connect();
        console.log("Connected to MongoDb");
        db= client.db('jksurgical');
        return db;
    }
    catch(err)
    {
        console.log("Error connecting to MongoDb",err);
    }
}
module.exports=main;