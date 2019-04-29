class Usuarios{

	constructor() {
		this.usuarios = [];
	}

	agregarUsuario(correo, nombre){
		let usuario = {correo, nombre}	
		this.usuarios.push(usuario)
		return this.usuarios;
	}

	getUsuarios (){
		return this.usuarios
	}

	getUsuario(nombre){
		let usuario = this.usuarios.filter( user => user.nombre == nombre)[0]
		return usuario
	}

	borrarUsuario(nombre){
		let usuarioBorrado = this.getUsuario(nombre)
		this.usuarios = this.usuarios.filter( user => user.nombre!= nombre)
		return usuarioBorrado
	}

	getDestinatario(nombre){
		let destinatario = this.usuarios.filter(user => user.nombre == nombre)[0]
		return destinatario
		}
}


module.exports = {
	Usuarios
}
