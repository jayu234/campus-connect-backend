const app = require('./app');

const dotenv = require('dotenv');
dotenv.config({path: "config/config.env"});

app.listen(process.env.PORT, ()=>{
    console.log(`Server running at ${process.env.HOST}/${process.env.PORT}`);
})