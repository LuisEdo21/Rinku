const express = require('express')
const axios = require('axios')
const router = express.Router()
const mysql =require('mysql')
const cors = require('cors')

const app = express()

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// Habilita CORS (Cross-Origin Resource Sharing)
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:3000'
}))

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

// ====== RUTAS PARA ACCEDER A LAS VISTAS DEL PROYECTO Y OBTENER LOS DATOS DE LA BASE DE DATOS ======
// Carga la página inicial del proyecto (Index) (Reporte de Actividades)
// GET /actividad: Retorna una lista con todos los registros de actividades que se han realizado. 
router.get('/', (req, res) => {
    const MySQLQuery = "CALL sp_obtenerActividad()";

    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            res.send('ERROR: No fue posible realizar la conexión a la BD de Rinku - Luis Eduardo Villela Zavala')
            throw err
        }
        else
        {
            console.log("=== LISTA DE ACTIVIDADES ===")
            let data = JSON.parse(JSON.stringify(result[0])) 
            console.log(data)
            res.render('index.ejs', {params: data})
        }
    })

    //res.render('index.ejs', {})
    //res.send('Rinku - Sr Fullstack Code Challenge (Coppel) - Luis Eduardo Villela Zavala')
})

// Página para crear un nuevo reporte de actividad
router.get('/nueva_actividad', (req, res) => {
    const MySQLQuery = "CALL sp_obtenerEmpleados()";
    
    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            res.send('ERROR: No fue posible realizar la conexión a la BD de Rinku - Luis Eduardo Villela Zavala')
            throw err
        }
        else
        {
            console.log("=== LISTA DE EMPLEADOS A UTILIZAR ===")
            let data = JSON.parse(JSON.stringify(result[0])) 
            console.log(data)
            res.render('nueva_act.ejs', {params: data})
        }
    })

    //res.render('nueva_act.ejs', {})
})

// Página para crear un nuevo empleado
router.get('/nuevo_empleado', (req, res) => {
    res.render('nuevo_emp.ejs', {})
})

// POST /addNuevoEmpleado: Crea un nuevo empleado, lo almacena en la base de datos y retorna su información.
router.post('/addNuevoEmpleado', (req, res) => {
    // Se obtienen los parámetros directamente del body.
    const {numEmpleado, nombreEmp, apellidoEmp, idRol} = req.body

    // Se declara la ejecución del Procedimiento Almacenado correspondiente
    const MySQLQuery = "CALL crear_empleado(" + numEmpleado +", '"+ nombreEmp +"', '"+ apellidoEmp +"', "+ idRol + ")";
    console.log(MySQLQuery)

    // Se inicializa la conexión a la base de datos y se intenta ejecutar el procedimiento almacenado.
    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            console.log("ERROR: ", err)
            res.redirect("/error")
        }
        else
        {
            console.log(req.body)
            res.redirect("/success")
        }

        //res.status(200).json(req.body)
    })
})

// POST /addNuevaActividad: Crea un nuevo registro de actividad para un empleado en particular y lo almacena en la base de datos.
router.post('/addNuevaActividad', (req, res) => {
    // Se obtienen los parámetros directamente del body.
    const {inNumEmp, inNombre, inApellido, rolEmpleado, bonoBasePorHora, inMes, inAnio, inHorasTrab, inEntregas, inSueldoBase, inBonoEntregas, inBonoHoras, 
        inISR, inMontoISR, inValesDesp, inSueldoNeto} = req.body


    const DatosEmpOrig = JSON.parse(inNumEmp)

    // Se declara la ejecución del Procedimiento Almacenado correspondiente
    const MySQLQuery = "CALL crear_actividad(" + DatosEmpOrig.idEmp + ", " + rolEmpleado.substring(0, 1) + ", "+ inMes + ", "+ inAnio + ", "+ inHorasTrab + ", "+ inEntregas + ", "+ inSueldoBase + ", "+ inBonoEntregas + ", "+ inBonoHoras + ", "+ inMontoISR + ", "+ inValesDesp + ", "+ inSueldoNeto + ")";
    console.log(MySQLQuery)
    // Se inicializa la conexión a la base de datos y se intenta ejecutar el procedimiento almacenado.
    dbConnection.query(MySQLQuery, function(err, result) {
        if (err)
        {
            console.log("ERROR: ", err)
            res.redirect("/error")
        }
        else
        {
            console.log(req.body)
            res.redirect("/success")
        }
    })
})

// Página para mostrar que el registro se realizó de forma satisfactoria
router.get('/success', (req, res) => {
    res.render('success.ejs', {})
})

// Página de error
router.get('/error', (req, res) => {
    res.render('error.ejs', {})
})

// === NOTA: LOS 3 ENDPOINTS SIGUIENTES FUNCIONAN SOLAMENTE UTILIZANDO POSTMAN!!! ===
// POST /nuevoEmpleado: Crea un nuevo empleado, lo almacena en la base de datos y retorna su información.
router.post('/nuevoEmpleado', (req, res) => {
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
router.post('/nuevaActividad', (req, res) => {
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
router.get('/actividad', (req, res) => {
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

// ====== ARCHIVOS DE ESTILO Y SCRIPTS (De ser necesarios) ======
router.get('/css/estilos.css', (req, res) => {
	res.sendFile(__dirname + '/css/estilos.css');
});

router.get('*', (req, res) => {
	res.end('Pagina no encontrada')
})

module.exports = router