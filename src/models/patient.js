const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    cedula: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    historiaClinica: [
        {
            fecha: { type: Date, required: true },
            descripcion: { type: String, required: true },
            doctor: {
                nombre: { type: String, required: true },
                cedula: { type: String, required: true },
            },
        },
    ],
});

module.exports = mongoose.model('Patient', patientSchema);