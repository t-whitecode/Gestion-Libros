socket = io()

socket.on('mensaje',(informacion)=>{
	console.log(informacion)
});

socket.emit("mensaje","usuario numero");

socket.emit("contador");

socket.on("contador",(contador)=>{
	console.log(contador)
});

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')
formulario.addEventListener('submit',(datos)=>{
	datos.preventDefault()
	const texto = datos.target.elements.texto.value
	const nombre = datos.target.elements.nombre.value
	socket.emit("texto",{
		nombre: nombre,
		mensaje: texto },()=>{
			mensaje.value = ''
			mensaje.focus()
		})
});

socket.on("texto",(text)=>{
	console.log(text)
	chat.innerHTML = chat.innerHTML + text.nombre + ':' + text.mensaje + '<br>'
})

/*
var param = new URLSearchParams(window.location.search)

var usuario = param.get(req.session.nombreUsuario)

socket.on("connect",() =>{
	console.log(usuario)
	socket.emit('usuarioNuevo', usuario)

})

socket.on('nuevoUsuario', (texto) =>{
	console.log(texto)
	chat.innerHTML  = chat.innerHTML + texto + '<br>'
})

socket.on('usuarioDesconectado', (texto) =>{
	console.log(texto)
	chat.innerHTML  = chat.innerHTML + texto + '<br>'
})

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

formulario.addEventListener('submit', (datos) => {	
	datos.preventDefault()
	socket.emit('texto', mensaje.value, () => {			
			mensaje.value = ''
			mensaje.focus()
			}
		)
})

socket.on("texto", (text) =>{
	console.log(text)
	chat.innerHTML  = chat.innerHTML + text + '<br>'
})

*/