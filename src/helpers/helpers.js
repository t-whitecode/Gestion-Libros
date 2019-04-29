const hbs = require('hbs');

hbs.registerHelper('listaL',(libros)=>{
    let texto = `<div class="publicar"> `;
    libros.forEach(Libro =>{
        texto = texto +
            `<p>Nombre del libro:  ${Libro.nombreL}</p>
            <p>Autor:  ${Libro.autor} </p>
            <p>Usuario:  ${Libro.descripcion} </p>
            <p>Descripcion:  ${Libro.nombre} </p>
            <p>Id: ${Libro.id} </p>
            <p>Correo: ${Libro.correo} </p>
            <hr style="width:100%;" color="·c5df16">`;
    })
    texto = texto + '</div>';
    return texto;
});

/*
libroRegistro = [];
hbs.registerHelper( 'crear', (libro) =>{
    listado();
    let L = {
        nombre: libro.nombreL,
        autor: libro.autor,
        nombre: libro.nombre,
        imagen: libro.imagen,
        descripcion: libro.descripcion,
        id: libro.id,
        correo: libro.correo
    };
    let duplicado = libroRegistro.find(nom => nom.libro == L.nombreL)
    if (!duplicado){
        libroRegistro.push(L);
        console.log(libroRegistro);
        save();
        return (" ha sido registrado exitosamente.")
    }
    else
        return ('no pudo ser registrado. Ya existe otro libro registrado con ese nombre');
});

<th></th>
<td>${Libro.imagen}</td>*/

hbs.registerHelper('listar', (listado) => {
let texto = `	<form action="/masin" method="post">
		<table class='table table-striped table-hover'> 
				<thead class='thead-dark'>
				<th>Nombre del Libro</th>
				<th>Autor</th>
				<th>Calificación</th>
				<th></th>
				</thead>
				<tbody>`;
	listado.forEach(libro =>{
		texto = texto + 
				`<tr>
				<td> ${libro.nombreL} </td>
				<td> ${libro.autor} </td>
				<td> ${libro.calificacion}</td>
				<td><button class="btn btn-primary" name="nombre" value=${libro.nombreL}>Más Información</button></td>
				
				</tr> `;
	})
	texto = texto + '</tbody> </table></form>';	
	return texto;

});

hbs.registerHelper('listar2', (listado) => {
    let texto = `	<form action="/elimin" method="post">
            <table class='table table-striped table-hover'> 
                    <thead class='thead-dark'>
                    <th>Nombre del Libro</th>
                    <th>Autor</th>
                    <th>Usuario/th>
                    <th></th>
                    </thead>
                    <tbody>`;
        listado.forEach(libro =>{
            texto = texto + 
                    `<tr>
                    <td> ${libro.nombreL} </td>
                    <td> ${libro.autor} </td>
                    <td> ${libro.usuario}</td>
                    <td><button class="btn btn-primary" name="nombre" value=${libro.nombreL}>Eliminar</button></td>
                    
                    </tr> `;
        })
        texto = texto + '</tbody> </table></form>';	
        return texto;
    
    });

    hbs.registerHelper('listar3', (listado) => {
        let texto = `	<form action="/elimina" method="post">
                <table class='table table-striped table-hover'> 
                        <thead class='thead-dark'>
                        <th>Nombre de Usuario</th>
                        <th>Correo</th>
                        <th>Telefono/th>
                        <th></th>
                        </thead>
                        <tbody>`;
            listado.forEach(libro =>{
                texto = texto + 
                        `<tr>
                        <td> ${libro.nombreUsuario} </td>
                        <td> ${libro.correo} </td>
                        <td> ${libro.telefono}</td>
                        <td><button class="btn btn-primary" name="nombre" value=${libro.nombreUsuario}>Eliminar</button></td>
                        
                        </tr> `;
            })
            texto = texto + '</tbody> </table></form>';	
            return texto;
        
        });