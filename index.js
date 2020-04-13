// MIDDLEWARES
const express = require('express')
const server = express()
const bp = require('body-parser')
const jwt = require('jsonwebtoken')
const signature = 'my_secret'

// CONEXION A BD
const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://root:1234@localhost:3306/resto')

// STARTUP
server.use(bp.json())
server.listen('3000', () => {
    console.log('Servidor iniciado')
})


// ENDPOINTS
server.post('/signup', async (req, res, next) => {
    const newuser = req.body
    const existsUsername = await searchByParam('username', newuser.username)
    const existsEmail = await searchByParam('email', newuser.email)

    if(existsUsername.length > 0){
        res.status(409).json('Nombre de usuario en uso')
        return
    }
    if(existsEmail.length > 0){
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

server.get('/login', async (req, res, next) => {
    const { username, password } = req.body
    const existsUser = await searchByParam('username', username)
    if(existsUser.length > 0){
        if(existsUser[0].password === password){
            const token = generateToken(existsUser[0])
            res.status(200).json(token)
        }else{
            res.status(401).json('Clave incorrecta')
        }
    }else{
        res.status(401).json('Usuario incorrecto')
    }
})

server.get('/users', validateToken, async (req, res, next) =>{
    const isAdmin = req.user.is_admin
    console.log('aca llegue ' + isAdmin)
    if(isAdmin == 0){
        console.log('aca no tiene que entrar')
        res.json(req.user)
    }else{
        const usersList = await searchTable('users')
        const usersInfo = usersList.map((user) => {
            delete user.password
            return user
        })
        res.send(usersInfo)
    }
})

// FUNCIONES
async function searchByParam (filter, inputParam){
    const searchResult = await sequelize.query(`SELECT * FROM users WHERE ${filter} = ?`,
    { replacements: [inputParam], type: sequelize.QueryTypes.SELECT })
    console.log(searchResult)
    return searchResult
}
async function searchTable (table){
    const result = await sequelize.query(`SELECT * FROM ${table}`, { type: sequelize.QueryTypes.SELECT })
    console.log(result)
    return result
}

function generateToken(user){
    return jwt.sign(user, signature)
}

function validateToken (req, res, next){
    const autHeader = req.headers.authorization
    if(autHeader){
        const token = autHeader.split(' ')[1]
        jwt.verify(token, signature, (err, data) =>{
            if(data) {
                console.log(data)
                req.user = data
                return next()
            }else{
                res.status(401).json('hay un error ' + err)
            }
        })
    }else{
        res.status(403).json({ error: 'No se ricibio un token' })
    }

}