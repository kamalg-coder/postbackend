const express=require('express')

const cors=require('cors')

const { userRouter } = require('./routes/User.routes')

const { connection } = require('./config/db')

const { authenticate } = require('./middlewares/Authentication.middleware')
const { postRouter } = require('./routes/Post.routes')


const app=express()

require('dotenv').config()

const port=process.env.port

app.use(express.json())

app.use(cors())


app.use('/users',userRouter)

app.use(authenticate)

app.use('/posts',postRouter)





app.listen(port,async()=>{
    try {
        await connection
        console.log('Connected to database')
    } catch (error) {
        console.log('Cannot connected to DB')
    console.log(error)
    }
    console.log(`Server is listened at ${port}`)
})