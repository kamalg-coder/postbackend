const express = require('express')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { UserModel } = require('../models/User.model')
const userRouter = express.Router()

userRouter.post('/register', async (req, res) => {
    const { name, email, gender, age, city, is_married, password } = req.body
    const userAld = await UserModel.find({ email })
      if (userAld.length>0) {
        res.status(500).send("User already exist, please login")
    } else {
        try {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) res.status(500).send({ msg: "Somthing went wrong" })
                else {
                    const user = new UserModel({ name, email, gender, age, city, is_married, password: hash })
                    await user.save()
                    res.status(201).send('User has been registerd')
                }
            })
        } catch (error) {
            res.send(400).send({ error: error.message })
        }
    }
})
userRouter.post('/login', async (req, res) => {
const {email,password}=req.body
try {
    const user=await UserModel.find({email})
    if(user.length>0){
        bcrypt.compare(password,user[0].password,(err,result)=>{
            if(result){
                let token=jwt.sign({userID:user[0]._id},process.env.key)
                res.status(201).send({msg:'Login Successful',token:token})
            }else{
                res.send(400).send({ msg:'wrong credential',error:err.message }) 
            }
        })
    }else{
        res.send(400).send({ msg:'wrong credential' }) 
    }
} catch (error) {
    res.send(400).send({ msg:'Something went wrong',error:error.message })
}
})

module.exports={userRouter}