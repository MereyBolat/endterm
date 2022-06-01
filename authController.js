const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const {secret}= require("./config")
const generateAccessToken = (id, role) => {
    const payload= {
        id,
        role
    }
    return jwt.sign(payload, secret, {expiresIn:"1h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors})
            }
            const username = req.body.signName
            const password = req.body.signPassword
            const confirmPass = req.body.signPassword2
            if(password !== confirmPass){
                return res.status(400).json({message: 'Password is not correct'})
            }
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'A user with this name already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password:hashPassword,roles: [userRole.value]})
            await user.save()
            return res.json({message: 'The user has been successfully registered'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res){
        try {
            const username=req.body.username
            const password=req.body.password

            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message:"Пользователь "+username+" не найден"})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message:` Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        }catch (e){
            console.log(e)
            res.status(400).json({message: 'Login Error'})
        }
    }
    async getUsers(req, res){
        try {
            const users = await User.find()
            res.json(users)
            res.json

        }catch (e){
            console.log(e)
        }
    }

    async delete(req,res){
        try{
            const erase= req.body.deluser
            await User.deleteOne({username: erase}).then(data => {
                if (data.deletedCount===0) {
                    res.json("User not found")
                } else {
                    res.json("User "+erase+" deleted successfully!")
                }
            }).catch(err => {
                res.json(err.message)
            });
        }catch (e){
            console.log(e)
        }
    }

    async update(req,res){
        try{
            const username=req.body.upusername
            const newPassword=req.body.upnewpassword
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message:"Пользователь "+username+" не найден"})
            }
            const hashPassword = bcrypt.hashSync(newPassword, 7);
            const result= await User.findOneAndUpdate(
                {username: username},
                {password: hashPassword},
                function(err, result){

                    console.log(result);
                }
            );

        }catch (e){
            console.log(e)
        }
    }

    async create(req,res){
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Creating error', errors})
            }
            const username = req.body.crusername
            const password = req.body.crpassword
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'A user with this name already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password:hashPassword,roles: [userRole.value]})
            await user.save()
            return res.json({message: 'The user  has been successfully created'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Creating error'})
        }
    }
    async find(req,res){
        try{
            const username=req.body.username
            const result = await User.find({username: username})
            res.render('temp',{name:username,password:result[0].password,id:result[0]._id,role:result[0].roles[0],title:'Finder', active:'adminpage'})
        } catch (e) {
            console.log(e)
        }
    }


}

module.exports = new authController()