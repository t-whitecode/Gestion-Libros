const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const registrarseSchema = new Schema({
	nombreUsuario : {
		type : String,
        require : true,
        unique: true	
    },
    nombyapel : {
        type : String,
        require : true
    },
    contrasenaUsuario:{
        type: String,
        require: true
    },
    rol:{
        type: String,
        default : 'Usuario'
    },
    correo : {
		type: String,
		required: true					
	},
	telefono : {
		type: Number,
		required: true						
	},
	avatar : {
		type: Buffer
	}
});
registrarseSchema.plugin(uniqueValidator);
const Users = mongoose.model('Users', registrarseSchema);
module.exports = Users;