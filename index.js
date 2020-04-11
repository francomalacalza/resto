// MIDDLEWARES
const express = require('express')
const server = express()
const bp = require('body-parser')
const jwt = require('jsonwebtoken')
const signature = 'mi_firma'

// CONEXION A BD
const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://root:1234@localhost:3306/resto')

// STARTUP
server.use(bp.json())
server.listen('3000', () => {
    console.log('Servidor iniciado')
})

server.post('/signup', async (req, res, next) => {
    const newuser = req.body
    const existsUsername = await searchByParam('username', newuser.username)
    const existsEmail = await searchByParam('email', newuser.email)

    if(existsUsername){
        res.status(409).json('Nombre de usuario en uso')
        return
    }
    if(existsEmail){
        res.status(409).json('Ya existe un usuario registrado con ese email')
        return
    }
    if(newuser.username.trim() &&
        newuser.fullname.trim() &&
        newuser.password.trim() &&
        newuser.email.trim() &&
        newuser.phone.trim() &&
        newuser.address.trim()
        ){
        sequelize.query('INSERT INTO users (username, fullname, password, email, phone, address, is_admin) VALUES (:username, :fullname, :password, :email, :phone, :address, 0)', {replacements: newuser }).then(rtdo => res.status(200).json('Usuario creado' + rtdo))
        
    }else{
        res.status(400).json('Falta uno o mas datos')
    }
    
})

async function searchByParam (filter, inputParam){
    const searchResult = await sequelize.query(`SELECT * FROM users WHERE ${filter} = ?`,
    { replacements: [inputParam], type: sequelize.QueryTypes.SELECT })
    console.log(searchResult)
    return searchResult.length
}
