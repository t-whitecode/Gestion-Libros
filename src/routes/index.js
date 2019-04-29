require('./../config/config');
const express = require('express')
const app = express ()
const path = require('path')
const hbs = require ('hbs')
const dirViews = path.join(__dirname, '../../template/views')
const dirPartials = path.join(__dirname, '../../template/partials')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const session = require('express-session')
var MemoryStore = require('memorystore')(session)
require('./../helpers/helpers')

const dirPublic = path.join(__dirname, "../public")
const dirNode_modules = path.join(__dirname , '../node_modules')

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//hbs
app.set('view engine', 'hbs')
app.set('views', dirViews)
hbs.registerPartials(dirPartials)

//Static
app.use(express.static(dirPublic))
// app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
// app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//### Para usar las variables de sesión
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))


//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./runner'));



module.exports = app