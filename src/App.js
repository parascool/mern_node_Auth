require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path')
const hbs = require('hbs');
const bcrypt = require('bcryptjs');


require('./db/conn')
const Register = require('./models/registers');

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partial_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// console.log(process.env.SECRET_KEY);

app.get('/', (req, res) => {
    res.render("index")
})
app.get('/signup', (req, res) => {
    res.render("signup")
})
app.post('/signup', async(req, res) => {
    try {

        const registerEmployee = new Register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        console.log(`Registration part ${registerEmployee}`);
        const token = await registerEmployee.generateAuthToken();
        console.log(`register token ${token}`);
        
        const registered = await registerEmployee.save()
        res.status(201).render('index')

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/login', async(req, res) => {
    try {
            email= req.body.email;
            password= req.body.password;

            const useremail = await Register.findOne({email});

            const isMatch = await bcrypt.compare(password, useremail.password);

            const token = await useremail.generateAuthToken();
            console.log(`login token ${token}`);

            if(isMatch){
                res.status(201).render("profile");
            }
            else{
                res.send("Invalid password details")
            }

            // if(useremail.password === password){
            //     res.status(201).render('index')
            // }
            // else{
            //     res.send("wrong credentials")
            // };
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log(`Server is listining on PORT npo ${port}`);
})