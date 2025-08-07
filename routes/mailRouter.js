const express = require('express');
const mailRouter = express.Router();
const sendEmail = require('../config/nodemailer'); // Importa la función para enviar correos

mailRouter.post('/send-tracking', (req, res) => {
  const { email, trackingCode, orderDetails, shippingMethod } = req.body;

  // Verificar que los datos estén presentes
  if (!email || !trackingCode || !orderDetails || orderDetails.length === 0 || !shippingMethod) {
    return res.status(400).json({ error: 'Faltan datos para enviar el correo' });
  }

  // Crear el contenido del correo
  const subject = 'Código de seguimiento y detalles de tu compra';
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
    <div style="text-align: center;">
        <img src="cid:logo_cid" alt="Logo" style="width: 150px; height: auto;" />
    </div>
    <h1 style="color: #4CAF50; text-align: center;">Gracias por tu compra</h1>
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Hola <strong>Cliente</strong>,<br>
        Estamos encantados de confirmar que tu pedido ha sido procesado exitosamente.
    </p>
    <p style="font-size: 16px; color: #333;">Método de envío: <strong>${shippingMethod}</strong></p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px; color: #333;">Tu código de seguimiento es: <strong>${trackingCode}</strong></p>
        <p style="font-size: 16px; color: #333;">Detalles del pedido:</p>
        <ul style="list-style-type: none; padding: 0;">
            ${orderDetails.map(item => `
            <li style="padding: 10px; border-bottom: 1px solid #ddd;">
                <strong>${item.name}</strong> - Cantidad: ${item.quantity} - Precio: $${item.precio}
            </li>`).join('')}
        </ul>
        <p style="font-size: 18px; font-weight: bold; color: #333;">Total: $${orderDetails.reduce((total, item) => total + (item.precio * item.quantity), 0).toFixed(0)}</p>
    </div>
    <p style="font-size: 14px; text-align: center; color: #777;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
  </div>
`;

  // Llamar a la función sendEmail con los parámetros correctos
  sendEmail(email, subject, '', html) // Enviar el correo con el cuerpo HTML
    .then(() => {
      res.status(200).json({ message: 'Correo enviado exitosamente' });
    })
    .catch((error) => {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Error al enviar el correo' });
    });
});

module.exports = mailRouter;
