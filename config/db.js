const mongoose = require("mongoose");

const connectToMongo = ()=>{

    mongoose.connect(process.env.DB_URI)
    .then((data)=>{console.log(`Connected to  mongo successfully at host: ${data.connection.host}`);})
    .catch((err)=>{console.log(err);});
    
}

module.exports = connectToMongo;