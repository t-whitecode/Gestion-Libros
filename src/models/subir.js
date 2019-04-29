const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;
const LibroSchema = new Schema({
	nombreL : {
		type : String,
        require : true,
        unique : true	
    },
    usuario : {
		type : String,
        require : true
	},
    autor:{
        type: String,
        require: true
    },
	descripcion :{
        type : String,
        require: true
    },
    calificacion :{
        type : Number,
        require: true
    },
	avatar : {
		type: Buffer
	}
});

LibroSchema.plugin(uniqueValidator);
const Subir = mongoose.model('Subir', LibroSchema);
module.exports = Subir;