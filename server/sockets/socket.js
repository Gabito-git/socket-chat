const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios

io.on('connection', (client) => {
   
    client.on('entrarChat', ( data, callback ) => {

        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            })
        }

        client.join(data.sala)

        usuarios.agregarPersona( client.id, data.nombre, data.sala );
        // console.log(usuarios.getPersonasPorSala( data.sala ))
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala( data.sala ));

        callback( usuarios.getPersonasPorSala( data.sala ) );

    })

    client.on('crearMensaje', ({mensaje}) => {

        const persona = usuarios.getPersona( client.id );
        const mensajeAEnviar = crearMensaje(persona.nombre, mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensajeAEnviar);

    })

    client.on('disconnect', () => {

        const personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit( 'crearMensaje',  crearMensaje('Administrador', `${ personaBorrada.nombre } abandonó el chat`) );
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala( personaBorrada.sala ));

    })

    client.on('mensajePrivado', data => {
        const persona = usuarios.getPersona( client.id );
        client.broadcast.to( data.para ).emit('mensajePrivado', crearMensaje( persona.nombre, data.mensaje ))
    })

});