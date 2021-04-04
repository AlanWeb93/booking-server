const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'El nombre es Obligatorio'
    },
    email: {
        type: String,
        trim: true,
        required: 'El email es Obligatorio',
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {}
    }, { timestamps: true }
);

userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified("password")) {
        return bcrypt.hash(user.password, 12, function (err, hash) {
            if (err) {
                console.log("BCRYPT HASH ERR ", err);
                return next(err);
            }
            user.password = hash;
            return next();
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, match) {
        if (err) {
            console.log("password no coinciden", err);
            return next(err, false);
        }

        console.log("Password coinciden", match);
        return next(null, match);
    });
}

module.exports = model("User", userSchema);