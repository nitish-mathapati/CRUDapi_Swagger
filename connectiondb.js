const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/swaggerdb").then(()=>{
    console.log('Connected successfully to database')
}).catch(()=>{
    console.log("Could not connect to database")
});