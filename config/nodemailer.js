const nodemailer = require('nodemailer')

//trasnportador

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"poner variables de entorno",
        pass:"dwd"
    }
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from:'emailuser', // correo de donde sale
        to: to,
        subject: subject,
        text:text,
        html:html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('correo enviado' + info.response)
        }
    });

};

module.exports = sendEmail;