const mongoose = require('mongoose')

const bdconection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB, { dbName: 'bdartpachy' })
        console.log('conectado a la base de datos')
    } catch (error) {
        console.error(error)
    }
}

module.exports = bdconection;
