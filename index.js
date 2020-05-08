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
server.post('/signup', async (req, res) => {
    const newuser = req.body
    const existsUsername = await searchByParam('users', 'username', newuser.username)
    const existsEmail = await searchByParam('users', 'email', newuser.email)

    if(existsUsername.length > 0){
        res.status(409).json('Nombre de usuario en uso')
        return
    }
    if(existsEmail.length > 0){
        res.status(409).json('Ya existe un usuario registrado con ese email')
        return
    }
    if(newuser.username &&
        newuser.fullname &&
        newuser.password &&
        newuser.email &&
        newuser.phone &&
        newuser.address
        ){
        sequelize.query('INSERT INTO users (username, fullname, password, email, phone, address, isAdmin) VALUES (:username, :fullname, :password, :email, :phone, :address, 0)', {replacements: newuser }).then(rtdo => res.status(201).json('Usuario creado' + rtdo))
        
    }else{
        res.status(400).json('Falta uno o mas datos')
    }
    
})

server.get('/login', async (req, res) => {
    const { username, password } = req.body
    const existsUser = await searchByParam('users', 'username', username)
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

server.get('/users', validateToken, async (req, res) =>{
    const isAdmin = req.user.isAdmin
    console.log('aca llegue ' + isAdmin)
    if(isAdmin == 0){ //si no es admin solo ve su informacion
        res.json(req.user)
    }else{ // el admin puede ver la info de todos, salvo el password
        const usersList = await searchTable('users')
        const usersInfo = usersList.map((user) => {
            delete user.password
            return user
        })
        res.send(usersInfo)
    }
})

server.get('/products', validateToken, async(req, res) =>{
    const productsList = await searchByParam('products', 'available', '1')
    res.status(200).json(productsList)
})

server.post('/neworder', validateToken, async(req, res) =>{
    const userId = req.user.userId
    console.log(userId)
    const { products, paymentMethod } = req.body
    console.log(products)
    let total = 0
    products.forEach(async p => {
        const price = await sequelize.query(`SELECT price FROM products WHERE productId = ${p.productId}`,
        { type: sequelize.QueryTypes.SELECT })
        console.log(price[0].price)
        console.log(p.amount)
        total += price[0].price * p.amount
        console.log(total)
    });
    sequelize.query(`INSERT INTO orders (date, paymentMethod, total, status, userId) VALUES ('2020-07-02', '${paymentMethod}', ${total}, 'Confirmado', ${userId})`)
    .then(rtdo => res.status(201).json('Orden creada'))
})

server.put('/order/:id', validateToken, async (req, res, next) => {
    const isAdmin = req.user.isAdmin
    const orderId = req.params.id;
	const {orderStatus} = req.body;
    if(isAdmin == 1){
        const order = await searchByParam('orders', 'orderId', orderId)
        if(order.length > 0){
            sequelize.query(`UPDATE orders SET status = '${orderStatus}' WHERE orderId = ${orderId}`)
            .then(rtdo => res.status(200).send('Estado actualizado'))
        }else{
            res.status(400).send('No existe pedido con el id elegido')
        }
    }else{
        res.status(401).send('No tiene permisos')
    }
})

// FUNCIONES

async function searchByParam (table, filter, inputParam){
    const searchResult = await sequelize.query(`SELECT * FROM ${table} WHERE ${filter} = ?`,
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