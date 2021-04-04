const expressJwt = require('express-jwt');
const Hotel = require('../models/hotel');

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

const hotelOwner = async (req, res, next) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    let owner = hotel.postedBy._id.toString() === req.user._id.toString();
    if (!owner) {
        return res.status(403).send("No Autorizado");
    }
    next();
}

module.exports = {
    requireSignin,
    hotelOwner
}
