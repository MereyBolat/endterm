const express = require("express");
const mongoose = require("mongoose")
const app = express();
const port = 3000;
const controller = require("./authController")

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/', require('./routes/homeRoute'))
app.use('/about', require('./routes/aboutRoute'))
app.use('/contacts', require('./routes/contactsRoute'))
app.use('/shopCart', require('./routes/shopCartRoute'))
app.use('/admin', require('./routes/adminRoute'))
app.use('/login', require('./routes/loginRoute'))
app.use('/registration', require('./routes/registrationRoute'))

app.delete('/admin/delete', controller.delete)
app.post('/admin/user', controller.create)
app.post('/admin/find', controller.find)

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');



const start =async () => {
    try{
        app.use(
            '/api-docs',
            swaggerUi.serve, 
            swaggerUi.setup(swaggerDocument)
        );
            await mongoose.connect('mongodb+srv://must_dilnaz:111@cluster0.i3qjv.mongodb.net/?retryWrites=true&w=majority');
        app.listen(process.env.PORT || port, () =>
        console.log(`App listening at http://localhost:${port}`)
    );    }catch (e){
        console.log(e)
    }
}
start()
