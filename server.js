
const express = require('express')
const cors = require('cors')
const app = express()
const rotasCinema = require('./routes')

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', rotasCinema)   

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`)
})