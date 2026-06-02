require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

async function seed() {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_REGION, MONGODB } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('Faltan variables ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD en .env');
        process.exit(1);
    }
    if (!MONGODB) {
        console.error('Falta MONGODB en .env');
        process.exit(1);
    }

    await mongoose.connect(MONGODB);
    console.log('Conectado a MongoDB');

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existe = await User.findOne({ email: ADMIN_EMAIL });
    if (existe) {
        existe.password = hashed;
        if (ADMIN_USERNAME) existe.username = ADMIN_USERNAME;
        if (ADMIN_REGION) existe.region = ADMIN_REGION;
        existe.role = 'admin';
        await existe.save();
        console.log(`Admin existente actualizado: ${ADMIN_EMAIL}`);
        console.log(`Username: ${existe.username} | Rol: ${existe.role}`);
    } else {
        const admin = new User({
            username: ADMIN_USERNAME,
            name: 'Administrador',
            email: ADMIN_EMAIL,
            password: hashed,
            region: ADMIN_REGION || 'Chile',
            role: 'admin'
        });
        await admin.save();
        console.log(`Admin creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }
    console.log('Password sincronizada con ADMIN_PASSWORD del .env.');

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Error en seed:', err);
    process.exit(1);
});
