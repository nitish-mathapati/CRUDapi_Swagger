const mongoose = require('mongoose');

const cities = new mongoose.Schema({
    city_name:{
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    }
},
    {
        timestamps:true
    }
);

module.exports = mongoose.model('city',cities);