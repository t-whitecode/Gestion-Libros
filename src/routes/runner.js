require('./../config/config');
const express = require('express')
const app = express ()
const path = require('path')
const hbs = require ('hbs')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const bcrypt = require('bcrypt');
const session = require ('express-session')
const multer = require('multer');
const Estudiante = require('./../models/registrar')
const Subir = require('./../models/subir')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


require('../helpers/helpers');



const dirNode_modules = path.join(__dirname, '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

const dirViews = path.join(__dirname, '../../template/views')
const dirPartials = path.join(__dirname, '../../template/partials')

app.set('view engine', 'hbs')
app.set('views', dirViews)
hbs.registerPartials(dirPartials)


app.use(bodyParser.urlencoded({ extended: false}))

app.use (session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true
}))

app.get('/', (req, res ) => {
	res.render('inicio', {
		titulo: 'Inicio',
	})	
});

var upload = multer({
    fileFilter (req, file, cb) {
      if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
          return cb(new Error('Archivo no Válido')) 
      }
      cb(null,true)
    }
})


app.post('/registra', upload.single('archivo'), (req, res ) => {
    let estudiante = new Estudiante ({
        nombreUsuario: req.body.nombreUsuario,
        nombyapel: req.body.nombyapel,
        contrasenaUsuario: bcrypt.hashSync(req.body.contrasenaUsuario, 15),
        correo: req.body.correo,
        telefono: req.body.telefono,
        avatar: req.file.buffer
    })
    const msg = {
        to : req.body.correo,
        from: 'jpiceruso@gmail.com',
        subject: 'Bienvenido',
        text: 'Bienvenido al Sistema de Control de Libros. Usted se ha registrado Exitosamente.'
    }
    estudiante.save((err, resultado) => {
        if (err){
            return res.render ('indexpost1', {
                mostrar : err
            })			
        }
        sgMail.send(msg);
        res.render ('indexpost1', {			
            mostrar : resultado.nombyapel
        })		
    })			
});

app.post('/ingresar',  (req, res) => {	
	Estudiante.findOne({nombreUsuario : req.body.nombreUsuario}, (err, resultados) => {
		if (err){
			return console.log(err)
		}
		if(!resultados){
			return res.render ('ingresar', {
			mensaje : "Usuario o Contraseña incorrecta"			
			})
		}
		if(!bcrypt.compareSync(req.body.contrasenaUsuario, resultados.contrasenaUsuario)){
			return res.render ('ingresar', {
			mensaje : "Usuario o Contraseña incorrectaS"			
			})
		}	
			//Para crear las variables de sesión
			req.session.usuario = resultados.nombreUsuario	
			req.session.nombre = resultados.nombyapel
            req.session.rol = resultados.rol
            avatar = resultados.avatar.toString('base64')

            if(resultados.rol == 'Usuario') {
                res.render('ingresar', {
                    mensaje : "Bienvenido " + resultados.nombreUsuario,
                    nombre : resultados.nombreUsuario,
                    sesion1 : true,
                    avatar : avatar						
                    })
                }
            else {
                res.render('ingresar', {
                    mensaje : "Bienvenido administrador " + resultados.nombreUsuario,
                    nombre : resultados.nombreUsuario,
                    sesion2 : true,
                    avatar : avatar						
                    })
            }
	})
})

app.post('/crearL', upload.single('archivo'),(req, res ) => {
	let libro = new Subir ({
        nombreL: req.body.nombreL,
        autor: req.body.autor,
        descripcion: req.body.descripcion,
        calificacion: req.body.calificacion,
        usuario: req.session.usuario,
        avatar: req.file.buffer
        })
        libro.save((err, resultado) => {
            if (err){
                return res.render ('indexpost', {
                    mostrar : err
                })			
            }
            res.render ('indexpost', {			
                mostrar : "Se ha subido correctamente el libro: " + resultado.nombreL
            })		
        })
   		
    });

    app.post('/masin', (req, res) => {	

        Subir.findOne({nombreL : req.body.nombre}).exec((err, curso) =>{
            //Estudiante.findById(req.usuario, (err, usuario) =>{
            console.log (req.body.nombre)
            if (err){
                return console.log(err)
            }
            
			req.session.nombreL = curso.nombreL	
            avatar = curso.avatar.toString('base64')
            res.render('MasInfo', {
                mensaje : "El Libro Seleccionado es " + curso.nombreL,
                autor : "El autor es " + curso.autor,
                descripcion : curso.descripcion,
                avatar : avatar						
                })
            
        });
    })    

    app.post('/elimina', (req, res) => {
        Estudiante.findOneAndDelete({nombreUsuario : req.body.nombre}, req.body, (err, resultados) => {
            if (err){
                return console.log(err)
            }
    
            if(!resultados){
                res.render ('eliminado', {
                nombre : "no encontrado"			
            })
    
            }
            let nombre = resultados.nombreUsuario
            Estudiante.find({}).exec((err,respuesta)=>{
                if(err){
                    return console.log('su error fue'+err)
                }
                res.render ('eliminadoP',{
                    personas : respuesta,
                    nombreP : "Usted ha eliminado exitosamente al usuario" + nombre
                })
            })
            
        })	
    })

    app.post('/elimin', (req, res) => {
        Subir.findOneAndDelete({nombreL : req.body.nombre}, req.body, (err, resultados) => {
            if (err){
                return console.log(err)
            }
    
            if(!resultados){
                res.render ('eliminado', {
                nombre : "no encontrado"			
            })
    
            }
            let nombre = resultados.nombreL
            Subir.find({}).exec((err,respuesta)=>{
                if(err){
                    return console.log('su error fue'+err)
                }
                res.render ('eliminado',{
                    libros : respuesta,
                    nombreL : "Usted ha eliminado exitosamente el libro" + nombre
                })
            })
            
        })	
    })

    app.get('/salir', (req, res) => {
        req.session.destroy((err) => {
              if (err) return console.log(err)
        })	
        // localStorage.setItem('token', '');
        res.redirect('/')	
    })    
//registrar usuarios
app.get('/registrar',(req,res)=>{
	res.render('registrar')
});
app.get('/lista',(req,res)=>{
	Subir.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log('su error fue'+err)
        }
        res.render ('lista',{
            cursos : respuesta
        })
    })
});

app.get('/',(req,res)=>{
    Subir.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log('su error fue'+err)
        }
        res.render ('Index',{
            libros : respuesta
        })
    })
});

app.get('/gestionarL',(req,res)=>{
    Subir.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log('su error fue'+err)
        }
        res.render ('Libros',{
            libros : respuesta
        })
    })
});

app.get('/gestionarP',(req,res)=>{
    Estudiante.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log('su error fue'+err)
        }
        res.render ('Personas',{
            personas : respuesta
        })
    })
});
//hacer login

app.get('/login',(req,res)=>{
	res.render('login')
});

app.get('/chat',(req,res)=>{
	res.render('chat')
});

app.get('/subirL',(req,res)=>{
    res.render('subirL')
});

module.exports = app