const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name :{
        type: String,
        required:true,
    },
    email :{
        type: String,
        required:true,
        unique: true,
    },
    password :{
        type: String,
        required:true,
    },
    tokens: [{
        token : {
            type: String,
            required : true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function() {
    try {
        const token =  jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        await this.save()
        return token
    } catch (error) {
        res.send(error)
        console.log(error);
    }
}

employeeSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        // const hashPassword = await bcrypt.hash(password, 10);
        // console.log(`Normal password is ${this.password}`);
         this.password = await bcrypt.hash(this.password, 10);
        //  console.log(`Hashed password is ${this.password}`);
    }
    next()
})

const Register = new mongoose.model('Register', employeeSchema);

module.exports = Register