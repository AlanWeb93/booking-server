const { Schema, model } = require('mongoose');

const hotelSchema = new Schema({
    title: {
        type: String,
        required: "Titulo es obligatorio"
    },
    content: {
        type: String,
        required: "Contenido es obligatorio",
        maxlength: 10000
    },
    location: {
        type: String
    },
    price: {
        type: Number,
        required: "Precio es obligatorio",
        trim: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        data: Buffer,
        contentType: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    bed: {
        type: Number
    },
},
    {timestamps: true}
);

module.exports = model('Hotel', hotelSchema);
