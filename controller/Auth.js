const jwt=require('jsonwebtoken');
const secretKey="veerbathla@1234";
function generateToken(payload){
    return jwt.sign(payload,secretKey,{expiresIn:'24h'});
}
function verifyToken(token)
{
    try{
        const decoded=jwt.verify(token,secretKey);
        return {valid:true,decoded};
    }
    catch(err){
        return {valid:false,message:err.message};
    }
}
module.exports={generateToken,verifyToken};