const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect( process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        } );
        console.log('DB Conectada');
    } catch (error) {
        console.log('Error al conectar la base de datos');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;