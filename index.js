const express = require('express')
const path=require('path')
const mongoose = require('mongoose')
const controller = require("./authController")
const roleMiddleware = require("./middleware/roleMiddleware.js")
const app=express()
const authMiddleware= require('./middleware/authMiddleware.js')
const bodyParser = require('body-parser')


const db='mongodb+srv://must_dilnaz:j7hPC180@cluster0.yneqr.mongodb.net/shopOnline?retryWrites=true&w=majority'
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine','ejs')
app.set('views',path.resolve(__dirname,'ejs'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve(__dirname,'static')))


app.get('/',(req,res)=>{
    res.render('index',{title:'Main page ', active:'main'})
})

app.get('/features',(req,res)=>{
    res.render('features',{title:'Catalog', active:'features'})
})

app.get('/login',(req,res)=>{
    res.render('log',{title:'Logging', active:'log'})
})

app.get('/admin',(req,res)=>{
    res.render('adminpage',{title:'Admin Page', active:'adminpage'})
})

app.get('/registration',(req,res)=>{
    res.render('sign',{title:'sign'})
})


app.post('/registration', urlencodedParser,controller.registration)
app.post('/login', controller.login)
app.post('/delete', controller.delete)
app.post('/update', controller.update)
app.post('/create', controller.create)
app.post('/find', controller.find)

let port =process.env.PORT
if (port==null||port==""){
    port =8000
}




app.get('/users', roleMiddleware(['admin']),controller.getUsers)

const start =async () => {
    try{
        await mongoose.connect('mongodb+srv://must_dilnaz:j7hPC180@cluster0.yneqr.mongodb.net/shopOnline?retryWrites=true&w=majority');
        app.listen(port)
    }catch (e){
        console.log(e)
    }
}
start()

