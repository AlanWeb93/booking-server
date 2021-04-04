const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel"
    },
    session: {},
    orderedBy: { type: Schema.Types.ObjectId, ref: "User" }
},
{
    timestamps: true
});

module.exports = model('Order', orderSchema);
