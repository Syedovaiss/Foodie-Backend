require('dotenv').config()
const express = require('express')

const server = express()
const path = require('path')
const cors = require('cors')
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors())

server.get('/',(req,res) => {
    res.send("Welcome to Foodie")
})
// routers
const userRouter = require('./src/features/user/router/UserRouter')
const countryRouter = require('./src/features/countries/router/CountryRouter')

server.use('/api',userRouter)
server.use('/api',countryRouter)
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server running on http:/${process.env.HOST}:${process.env.PORT}`);
});