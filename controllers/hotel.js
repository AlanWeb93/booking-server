const Hotel = require("../models/hotel")
const fs = require('fs');
const Order = require("../models/order");

const create = async (req, res) => {
    // console.log("req.fields", req.fields);
    // console.log("req.files", req.files);

    try {
        let fields = req.fields;
        let files = req.files;

        let hotel = new Hotel(fields);
        hotel.postedBy = req.user._id;

        if (files.image) {
            hotel.image.data = fs.readFileSync(files.image.path);
            hotel.image.contentType = files.image.type;
        }

        hotel.save((err, result) => {
            if (err) {
                console.log("error al guardar hotel", err);
                res.status(400).send("Error al guardar hotel");
            }
            res.json(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            err: error.message
        });
    }
}

const hotels = async (req, res) => {
    // let all = await Hotel.find({ from: { $gte: new Date() } })
    let all = await Hotel.find({})
        .limit(24)
        .select("-image.data")
        .populate("postedBy", "_id name")
        .exec();

    res.json(all);
}

const image = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    if (hotel && hotel.image && hotel.image.data !== null) {
        res.set("Content-Type", hotel.image.contentType);
        return res.send(hotel.image.data);
    }
}

const sellerHotels = async (req, res) => {
    let all = await Hotel.find({ postedBy: req.user._id })
        .select("-image.data")
        .populate("postedBy", "_id name")
        .exec();

    res.send(all);
}

const remove = async (req, res) => {
    let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
        .select('-image.data')    
        .exec();
    res.json(removed);
}

const read = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId)
        .populate("postedBy", "_id name")
        .select("-image.data")
        .exec();
    res.json(hotel);
}

const update = async (req, res) => {
    try {
        let fields = req.fields;
        let files = req.files;

        let data = {...fields}

        if (files.image) {
            let image = {}
            image.data = fs.readFileSync(files.image.path);
            image.contentType = files.image.type;

            data.image = image;
        }

        let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
            new: true
        }).select("-image.data");
        
        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(400).send("Fallo la actualizacion del hotel. Intentelo de nuevo.")
    }
}

const userHotelBookings = async (req, res) => {
    let all = await Order.find({orderedBy: req.user._id})
        .select('session')
        .populate('hotel', '-image.data')
        .populate('orderedBy', '_id name')
        .exec();
    res.json(all);
}

const isAlreadyBooked = async (req, res) => {
    const {hotelId} = req.params;

    const userOrders = await Order.find({orderedBy: req.user._id})
        .select("hotel")
        .exec();

    let ids = [];
    for (let i = 0; i < userOrders.length; i++) {
        ids.push(userOrders[i].hotel.toString());
    }

    res.json({
        ok: ids.includes(hotelId)
    });
}

const searchListings = async (req, res) => {
    const {location, date, bed} = req.body;

    const fromDate = date.split(",");

    let result = await Hotel.find({ from: { $gte: new Date(fromDate[0]) }, location })
        .select('-image.data')
        .exec();
    res.json(result);
}

module.exports = {
    create,
    hotels,
    image,
    sellerHotels,
    remove,
    read,
    update,
    userHotelBookings,
    isAlreadyBooked,
    searchListings
}