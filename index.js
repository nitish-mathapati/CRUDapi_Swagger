require('./connectiondb');
const express = require('express');
const app = express();
const city = require('./schema/schema');
const User = require('./schema/userschema');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('./swagger');
const path=require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const { hash } = require('crypto');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

// Log file
app.use((req,res,next)=>{
    fs.appendFile('log.txt',
        `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}: ${req.params}:`,
        (err,data)=>{
            if(err)
            {
                return err;
            }
            next();
        }
    )
})

// Making changes to the req in middleware
// app.use('/',(req,res,next)=>{
//     console.log("this is the main middle ware");
//     req.cityname = "Kalaburgi";
//     next();
// })

// app.get('/',(req,res)=>{
//     res.cookie("nitish","happy");
//     res.render('home');
// })

// Creating login-logout 
app.get('/', (req,res)=>{
    res.render('index');
})

app.post('/signIN', (req,res)=>{

    // Method 1
    // const data = req.body;
    // Creading user (Adding user to DB)
    // const createdUser = await User.create(data);

    // Method 2
    const { username, email, password, age } = req.body;

    // Hashing the password
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(password, salt, async(err,hash)=>{
            const createdUser = await User.create({
                username,
                email,
                password:hash,
                age
            })

            const token = jwt.sign({email}, "balleballe");
            res.cookie("token",token);
        
            res.send(createdUser);
        })
    })

    // Creading user (Adding user to DB)
    // const createdUser = await User.create({
    //     username,
    //     email,
    //     password,
    //     age
    // })

    // res.send(createdUser);

})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async (req,res)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.send("Something went wrong");

    bcrypt.compare(req.body.password, user.password, (err,result)=>{
        if(result){
            const token = jwt.sign({email:user.email}, "balleballe");
            res.cookie("token",token);
            res.send("Yes, you can login");
        }
        else res.send("Something went wrong");
    })
})

app.get('/logout', (req,res)=>{
    res.cookie("token", "");
    res.redirect('/');
})

app.get('/trial',(req,res)=>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("nitish", salt, function(err, hash) {
            if(err)
            {
                console.log(err);
            }
            else{
                console.log(hash);
            }
        });
    });

    bcrypt.compare("nitish", "$2b$10$qJAfTHGwhiG.Gs3JqjbCsO2qFvVvXKCBeIi/.r3mRBXwsBD.7onCC", function(err, result) {
        if(result)
        {
            console.log("true");
        }
        else{
            console.log("false");
        }
    });
})


app.use('/city',(req,res,next)=>{
    console.log("this is city middleware");
    next();
})

// Test server
app.get('/city',function(req,res){
    res.render('cityadd');
});

// CRUD operation
// Create
app.post('/city/addcity', async function (req,res) {

    try {
        const data = req.body;
        await city.create(data);
        res.render('filemaker');
        // res.send("Successfully added to database");
    } catch (error) {
        res.send("Oopss..! Something went wrong")
        return res.send(error);
    }
});

// Read all
app.get('/city/getcity', async function (req,res) {
    try {
        const data = await city.find();
        // return res.json({
        //     data:data,
        //     message: "All cities details"
        // })
        console.log(req.cookies);
        res.render('allcity',{data:data});
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
    const newcity = req.body.city_name;
    const newpin = req.body.pincode;
    // console.log(newcity);
    try {
        await city.updateOne({city_name:cityName},{$set:{city_name:newcity, pincode:newpin}});
        // const city_name = newcity;

        const data = await city.find({city_name:newcity});
        return res.status(200).json({data:data});

    } catch (error) {
        res.send("Error in database to update");
        return res.status(400).send(error)
    }
})

// Delete by name
app.get('/city/deletebyname/:city_name', async function (req,res) {
    const cityName = req.params.city_name;
    try {
        await city.deleteOne({city_name:cityName});
        res.status(200).send("Successfully deleted city from database");
    } catch (error) {
        res.send("Error in database to delete");
        return res.status(400).send(error)
    }
})

app.get('/create-file',(req,res)=>{
    const file_name=req.query.file_name;
    const content=req.query.content;
    const file_path=path.join(__dirname,'folder',file_name+'.txt');
    fs.writeFile(file_path,content,(err,content)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("file saved successfully");
            res.redirect('/city');
        }
    })
})


app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(4000,()=>{
    console.log("Successfully connected to port");
})