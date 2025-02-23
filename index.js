require('./connectiondb');
const express = require('express');
const app = express();
const city = require('./schema');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('./swagger');


app.use(express.json());

// Test server
app.get('/city',function(req,res){
    res.send("Hey hi..! welcome to my server");
});

// CRUD operation
// Create
app.post('/city/addcity', async function (req,res) {
    try {
        const data = req.body;
        await city.create(data);
        res.send("Successfully added to database");
    } catch (error) {
        res.send("Oopss..! Something went wrong")
        return res.send(error);
    }
});

// Read all
app.get('/city/getcity', async function (req,res) {
    try {
        const data = await city.find();
        return res.json({
            data:data,
            message: "All cities details"
        })
    } catch (error) {
        return res.send(error);
    }
});

// Read by name
app.get('/city/getcitybyname/:city_name', async function(req,res) {
    try {
        const cityName = req.params.city_name;

        const data = await city.find({city_name:cityName});
        if (data.length == 0){
            return res.status(400).json({message: "This city is not preset in the database."});
        }
        return res.status(200).json({success: true, data});

    } catch (error) {
        res.send("Error in fetching the data from database");
        return res.status(400).send(error)
    }
});

// Update by name
app.put('/city/updatecitybyname/:city_name',async function (req,res) {
    const cityName = req.params.city_name;
    const {newcity, newpin} = req.body;
    try {
        await city.updateOne({city_name:cityName},{$set:{city_name:newcity, pincode:newpin}});
        const data = await city.find({city_name:newcity});
        return res.status(200).send({data});

    } catch (error) {
        res.send("Error in database to update");
        return res.status(400).send(error)
    }
})

// Delete by name
app.delete('/city/deletebyname/:city_name', async function (req,res) {
    const cityName = req.params.city_name;
    try {
        await city.deleteOne({city_name:cityName});
        res.status(200).send("Successfully deleted city from database");
    } catch (error) {
        res.send("Error in database to delete");
        return res.status(400).send(error)
    }
})

app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(4000,()=>{
    console.log("Successfully connected to port");
})