const nodemailer = require('nodemailer');
require('dotenv').config();

// Transportador
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.MAIL_USER, // correo de donde sale
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: [{
            filename: 'logo.png', // imagen embebida en el correo
            path: 'https://res.cloudinary.com/dpbpyzl96/image/upload/v1728514810/apweb/logo/pb5gdsfxr9kmgcuyewe6.png', // ruta de la imagen
            cid: 'logo_cid' // identificador único para usar en el HTML
        }]
    };

    // Devolver una promesa
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error); // Rechaza la promesa en caso de error
            } else {
                console.log('Correo enviado: ' + info.response);
                resolve(info); // Resuelve la promesa si el correo se envió correctamente
            }
        });
    });
};

module.exports = sendEmail;
