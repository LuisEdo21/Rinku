CREATE DATABASE Rinku;
USE Rinku;

SHOW TABLES;

CREATE TABLE Roles(
	idRol int NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    bono int NOT NULL,
    UNIQUE(idRol),
    PRIMARY KEY(idRol)
);

CREATE TABLE Empleados (
	idEmp int NOT NULL,
	nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    idRol int NOT NULL,
    UNIQUE(idEmp),
    PRIMARY KEY(idEmp),
    FOREIGN KEY(idRol) REFERENCES Roles(idRol)
);

CREATE TABLE Actividad (
	idAct int NOT NULL AUTO_INCREMENT,
    idEmp int NOT NULL,
    idRol int NOT NULL,
    mes int NOT NULL,
    anio YEAR NOT NULL,
    horasTrabajadas int NOT NULL,
    numEntregas int NOT NULL,
    sueldoBase DOUBLE NOT NULL,
    bonoEntregas DOUBLE NOT NULL,
    bonoHoras DOUBLE NOT NULL,
    isr DOUBLE NOT NULL,
    vales DOUBLE NOT NULL,
    sueldoNeto DOUBLE NOT NULL,
    UNIQUE(idAct),
    PRIMARY KEY(idAct),
    FOREIGN KEY(idEmp) REFERENCES Empleados(idEmp),
    FOREIGN KEY(idRol) REFERENCES Roles(idRol)
);

#Insertar a la tabla Roles los 3 roles conocidos (Chofer, Cargador, Auxiliar)
INSERT INTO Roles (idRol, nombre, bono) VALUES (1, 'Chofer', 10);
INSERT INTO Roles (idRol, nombre, bono) VALUES (2, 'Cargador', 5);
INSERT INTO Roles (idRol, nombre, bono) VALUES (3, 'Auxiliar', 0);

SELECT * FROM Roles;
SELECT * FROM Empleados;
SELECT * FROM Actividad;

#NOTA: Las tablas Empleados y Actividad serán alimentadas desde el sistema en ejecución.

#Declaración de los Procedimientos Almacenados que serán necesarios para el proyecto Rinku: 
#Crear un nuevo empleado: 
DELIMITER //
CREATE PROCEDURE crear_empleado (
	IN numEmpleado int,
    IN nombreEmp VARCHAR(100),
    IN apellidoEmp VARCHAR(100),
    IN idRol int 
)
BEGIN
	INSERT INTO Empleados (idEmp, nombre, apellidos, idRol) VALUES (numEmpleado, nombreEmp, apellidoEmp, idRol);
END //
DELIMITER ;

#Guardar un nuevo registro de actividad: 
DELIMITER //
CREATE PROCEDURE crear_actividad (
    IN NumEmpleado int,
    IN RolEmp int,
    IN MesTrab int,
    IN AnioTrab YEAR,
    IN NumHoras int,
    IN NumEnt int,
    IN SueldoBaseIni DOUBLE,
    IN BonoEnt DOUBLE,
    IN BonoHrs DOUBLE,
    IN Impuesto DOUBLE,
    IN ValesDesp DOUBLE,
    IN SueldoNetoFin DOUBLE
)
BEGIN
	INSERT INTO Actividad (idEmp, idRol, mes, anio, horasTrabajadas, 
						   numEntregas, sueldoBase, bonoEntregas, bonoHoras, isr, vales, sueldoNeto) 
	VALUES (NumEmpleado, RolEmp, MesTrab, AnioTrab, NumHoras, NumEnt, SueldoBaseIni, BonoEnt, BonoHrs, 
			Impuesto, ValesDesp, SueldoNetoFin);
END //
DELIMITER ;

#Obtener todas las actividades: 
DELIMITER //
CREATE PROCEDURE sp_obtenerActividad()
BEGIN
	SELECT * FROM Actividad;
END //
DELIMITER ;
#CALL [Nombre del Procedimiento] ([Parámetros...])

#Actualizar la actividad realizada por algún empleado: 

