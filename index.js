const express = require('express')
const mysql =require('mysql')
var bodyParser = require('body-parser')

const app = express()
const port = 3000

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: 'Proof1234',
    database: 'Rinku'
})

dbConnection.connect(err => {
    if(err)
    {
        console.log("La conexión a la base de datos de Rinku no está disponible")
        throw err
    }
    else 
    {
        console.log("Conectado correctamente a la base de datos de Rinku!!!")
    }
    
})

// Habilita body-parser para poder recibir datos por medio del body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Carga la página inicial del proyecto (Index)
app.get('/', (req, res) => {
    res.send('Rinku - Sr Fullstack Code Challenge (Coppel) - Luis Eduardo Villela Zavala')
})

// POST /nuevoEmpleado: Crea un nuevo empleado, lo almacena en la base de datos y retorna su información.
app.post('/nuevoEmpleado', (req, res) => {
    // Se obtienen los parámetros directamente del body.
    const {numEmpleado, nombreEmp, apellidoEmp, idRol} = req.body

    // Se declara la ejecución del Procedimiento Almacenado correspondiente
    const MySQLQuery = "CALL crear_empleado(" + numEmpleado +", '"+ nombreEmp +"', '"+ apellidoEmp +"', "+ idRol + ")";
    console.log(MySQLQuery)

    // Se inicializa la conexión a la base de datos y se intenta ejecutar el procedimiento almacenado.
    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            console.log("Algo anda mal con este query.")
            throw err
        }
        else
        {
            console.log("Nuevo empleado almacenado con éxito.")
            console.log(req.body)
        }

        res.status(200).json(req.body)
    })
})

// POST /nuevaActividad: Crea un nuevo registro de actividad para un empleado en particular y lo almacena en la base de datos.
app.post('/nuevaActividad', (req, res) => {
    // Se obtienen los parámetros directamente del body.
    const {NumEmpleado, RolEmp, MesTrab, AnioTrab, NumHoras, NumEnt, SueldoBaseIni, BonoEnt, BonoHrs, 
        Impuesto, ValesDesp, SueldoNetoFin} = req.body

    // Se declara la ejecución del Procedimiento Almacenado correspondiente
    const MySQLQuery = "CALL crear_actividad(" + NumEmpleado + ", " + RolEmp + ", "+ MesTrab + ", "+ AnioTrab + ", "+ NumHoras + ", "+ NumEnt + ", "+ SueldoBaseIni + ", "+ BonoEnt + ", "+ BonoHrs + ", "+ Impuesto + ", "+ ValesDesp + ", "+ SueldoNetoFin + ")";
    console.log(MySQLQuery)

    // Se inicializa la conexión a la base de datos y se intenta ejecutar el procedimiento almacenado.
    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            console.log("Algo anda mal con este query.")
            throw err
        }
        else
        {
            console.log("Nuevo registro de actividad almacenado con éxito.")
            console.log(req.body)
        }

        res.status(200).json(req.body)
    })
})

// GET /actividad: Retorna una lista con todos los registros de actividades que se han realizado. 
app.get('/actividad', (req, res) => {
    const MySQLQuery = "CALL sp_obtenerActividad()";

    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            console.log("Algo anda mal con este query.")
            throw err
        }
        else
        {
            console.log("=== LISTA DE ACTIVIDADES ===")
            console.log(result)
        }

        res.status(200).json(result)
    })
})

app.listen(port, () => {
    console.log(`Rinku - Sr Fullstack Code Challenge (Coppel) - Luis Eduardo Villela Zavala. Ejecutándose en el Puerto ${port}`)
})