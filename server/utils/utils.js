
const crearMensaje = (nombre, mensaje) =>( {

    nombre,
    mensaje,
    fecha: new Date().getTime()

})

module.exports = {
    crearMensaje
}