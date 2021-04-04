const express = require('express');
const connectDB = require('./config/db');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const app = express();
connectDB();

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

fs.readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
//app.use('/api', require('./routes/auth'));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Servidor en el puerto: ${port}`))
