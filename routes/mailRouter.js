const express = require('express');
const mailRouter = express.Router();
const sendEmail = require('../config/nodemailer')

mailRouter.post('/send-tracking', async (req, res) => {
    const { email, trackingCode, orderDetails } = req.body;

    // Construir el mensaje de correo
    const subject = 'Tu código de seguimiento y detalles de la compra';
    const text = `¡Gracias por tu compra! Tu código de seguimiento es: ${trackingCode}.`;
    const html = `
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu código de seguimiento es: <strong>${trackingCode}</strong></p>
      <p>Detalles de la compra:</p>
      <ul>
        ${orderDetails.map(item => `<li>${item.name}: ${item.quantity} x $${item.price}</li>`).join('')}
      </ul>
    `;

    // Enviar el correo
    try {
        await sendEmail(email, subject, text, html);
        res.status(200).send('Correo enviado');
    } catch (error) {
        res.status(500).send('Error al enviar el correo');
    }
});

module.exports = router;