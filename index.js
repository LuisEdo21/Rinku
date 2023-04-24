const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')

const app = express()
const port = 3000

// Declaración de la variable con la ruta del archivo de rutas
const routes = require('./routes');

// Habilita body-parser para poder recibir datos por medio del body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Habilita CORS (Cross-Origin Resource Sharing)
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:3000'
}))

// Declarar nombre de la app
app.set('appName', 'Rinku - Sr Fullstack Code Challenge (Coppel) - Luis Eduardo Villela Zavala')

// Especificar directorios
app.set('views', __dirname + '/views')
app.set(__dirname + '/css')
app.set(__dirname + '/js')

// Declarar el motor de vistas que será utilizado
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

// Uso del archivo de rutas
app.use(routes)

app.listen(port, () => {
    console.log(`Rinku - Sr Fullstack Code Challenge (Coppel) - Luis Eduardo Villela Zavala. Ejecutándose en el Puerto ${port}`)
})