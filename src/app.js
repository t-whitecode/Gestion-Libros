require('./config/config');
const express = require('express')
const app = express ()
const path = require('path')
const hbs = require ('hbs')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const session = require('express-session')
const server = require('http').createServer(app);
var MemoryStore = require('memorystore')(session)
const io = require('socket.io')(server);
//const bcrypt = require('bcrypt');
require('./helpers/helpers')

const directoriopublico = path.join(__dirname,'../public')
app.use(express.static(directoriopublico));

const directoriopartials = path.join(__dirname,'../partials');
hbs.registerPartials(directoriopartials);

const dirNode_modules = path.join(__dirname, '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

app.set('view engine', 'hbs')

app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

app.use((req, res, next) =>{
	// let token = localStorage.getItem('token')
	
	//  jwt.verify(token, 'virtual-tdea', (err, decoded) => {

 //        if (err) {
 //            return next();
 //        }

 //        req.usuario = decoded.usuario;
 //        console.log(req.usuario)
 //        res.locals.sesion = true
 //        res.locals.nombre = req.usuario.nombre
 //        next();

 //    });
 
	//En caso de usar variables de sesión
	if(req.session.usuario){
        if (req.session.rol == 'Usuario')	{	
            res.locals.sesion1 = true
            res.locals.nombre = req.session.usuario
        }else {
            res.locals.sesion2 = true
            res.locals.nombre = req.session.usuario
        }
    }	
	next()
})
app.use((req, res, next) =>{
	// let token = localStorage.getItem('token')
	
	//  jwt.verify(token, 'virtual-tdea', (err, decoded) => {

 //        if (err) {
 //            return next();
 //        }

 //        req.usuario = decoded.usuario;
 //        console.log(req.usuario)
 //        res.locals.sesion = true
 //        res.locals.nombre = req.usuario.nombre
 //        next();

 //    });
 
	//En caso de usar variables de sesión
	if(req.session.nombreL){
            res.locals.nombreL = req.session.nombreL
        
    }	
	next()
})

const { Usuarios } = require('./models/usuarios');
const usuarios = new Usuarios();

let contador = 0
io.on('connection', client => {

    console.log("un usuario se ha conectado");
    
    client.emit('mensaje',"Bienvenido");

    client.on("mensaje",(informacion)=>{
        console.log(informacion)
    });

    client.on("contador",()=>{
        contador ++
        console.log(contador);
        io.emit("contador",contador)
    })

    client.on("texto",(text, callback)=>{
        console.log(text)
        io.emit("texto",text)
        callback()
    })
/*
	client.on('usuarioNuevo', (usuario) =>{
		let listado = usuarios.agregarUsuario(req.session.correo, usuario)
		console.log(listado)
		let texto = `Se ha conectado ${usuario}`
		io.emit('nuevoUsuario', texto )
	})

	client.on('disconnect',()=>{
		let usuarioBorrado = usuarios.borrarUsuario(client.nombre)
		let texto = `Se ha desconectado ${usuarioBorrado.nombre}`
		io.emit('usuarioDesconectado', texto)
			})

	client.on("texto", (text, callback) =>{
		let usuario = usuarios.getUsuario(client.id)
		let texto = `${usuario.nombre} : ${text}`
		
		io.emit("texto", (texto))
		callback()
	})*/

	/*client.on("textoPrivado", (text, callback) =>{
		let usuario = usuarios.getUsuario(client.id)
		let texto = `${usuario.nombre} : ${text.mensajePrivado}`
		let destinatario = usuarios.getDestinatario(text.destinatario)
		client.broadcast.to(destinatario.id).emit("textoPrivado", (texto))
		callback()
	})*/

	
});

app.use(bodyParser.urlencoded({ extended: false}));

app.use(require('./routes/index'));

/*app.get('/',(req,res)=>{
    Subir.find({}).exec((err,respuesta)=>{
        if(err){
            return console.log('su error fue'+err)
        }
        res.render ('Index',{
            libros : respuesta
        })
    })
});

app.get('/subirL',(req,res)=>{
    res.render('subirL')
});

app.get('/',(req,res)=>{
	res.render('Index',{
        libros: res
    })
});
/*
app.get('*',(req,res)=> {
	res.render('error', {
		titulo: "Error 404"	
	})
});*
app.post('/subirL', (req, res ) => {
	let Libro = new Subir ({
        nombreL: req.body.nombreL,
        autor: req.body.autor,
        nombre: req.body.descripcion,
        descripcion: req.body.nombre,
        id: req.body.id,
        correo: req.body.correo
        })
        Libro.save((err, resultado) => {
            if (err){
                res.render ('indexpost', {
                    mostrar : err
                })			
            }		
            res.render ('indexpost', {			
                    mostrar : resultado.nombreL
                })		
        })			
    });

//registrar usuarios
app.get('/registrar',(req,res)=>{
	res.render('registrar')
});

app.post('/registrar',(req,res)=>{
    let registrarse = new Users ({
        nombre_Usuario: req.body.nombreUsuario,
        contrasena: req.body.contrasenaUsuario,
        rol:req.body.rol
    })
    registrarse.save((err,resultado)=>{
        if(err){
            res.render('indexpost',{
                mostrar: error
            })
            res.render('indexpost',{
                mostrar: resultado.nombre_Usuario
            })
        }
    })
});


//hacer login

app.get('/login',(req,res)=>{
	res.render('login')
});*/

/*mongoose.connect('mongodb://localhost:127.0.0.1/shareBooks', {useNewUrlParser: true},(err,result)=>{
        if(err){
           return console.log(err) 
        }
        console.log('Conectado correctamente')
    });*/

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});

server.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT)
});

app.get('/chat',(req,res)=>{
    res.render('chat')
});


module.exports = app;