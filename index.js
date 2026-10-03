require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
const router = require('./routes/index.routes');

const app = express();


app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json()); 


app.use(router);


const port = process.env.PORT || 4000; 
app.listen(port, () => {
    console.log(`Servidor de la API ejecutandose en el puerto ${port}`);
});