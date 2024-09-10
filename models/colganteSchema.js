const  mongoose = require('mongoose')

const colganteSchema = new mongoose.Schema({
    name: {type:String, require:true},
    descripcion:{type:String, require:true},
    precio:{type:Number, require:true},
    codigo:{type:String, require:true},
    stock:{type:Number, require:true},
    img:{type:String, require:true}
})


const Colgantes = mongoose.model('colgantes', colganteSchema);

module.exports = Colgantes;



