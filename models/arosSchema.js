const  mongoose = require('mongoose')

const arosSchema = new mongoose.Schema({
    name: {type:String, require:true},
    descripcion:{type:String, require:true},
    precio:{type:Number, require:true},
    codigo:{type:String, require:true},
    stock:{type:Number, require:true},
    img:{type:String, require:true}
})


const Aros = mongoose.model('aros', arosSchema);

module.exports = Aros;



