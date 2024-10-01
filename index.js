const express = require('express');
const cors = require('cors');
const bdconection = require('./config/database')
const dotenv = require('dotenv');
const arosRoute = require('./routes/arosRoute');
const colgantesRoute = require('./routes/colganesRoute');
const pulserasRoute = require('./routes/pulserasRoute');
const collaresRoute = require('./routes/collaresRoute');
const figurasRoute = require('./routes/figurasRoute');
const anillosRoute = require('./routes/anillosRoute');
const conjuntosRoute = require('./routes/conjuntosRoute');
const userRoute = require('./routes/userRoute');
const contactoRoute = require('./routes/conjuntosRoute')
const orderRoute = require('./routes/orderRoute');

// instacioamiento de express
const app = express();


// instaciamiento de utilidades
app.use(cors());
app.use(express.json());
dotenv.config();
// coneccion a la base de datos
bdconection();
// rutas 
app.use(arosRoute);
app.use(colgantesRoute)
app.use(pulserasRoute)
app.use(collaresRoute)
app.use(figurasRoute)
app.use(anillosRoute)
app.use(conjuntosRoute)
app.use(userRoute)
app.use(orderRoute)
app.use(contactoRoute)


// coneccion al puerto

app.listen(4000, () => {
    console.log('se conecto el puerto');
});
