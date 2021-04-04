const User = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    
    try {
        const {name, email, password} = req.body;

        if (!name) return res.status(400).send("Nombre es obligatorio");
        if (!password || password.length < 6) return res.status(400).send("Contraseña es obligatoria y debe tener al menos 6 carateres");

        let userExist = await User.findOne({email}).exec();
        if (userExist) return res.status(400).send("Email está en uso");

        const user = new User(req.body);
        
        await user.save();
        console.log("Usuario creado correctamente", user);
        return res.json({ ok: true });
    } catch (error) {
        console.log("Error en crear usuario", error);
        return res.status(400).send("ERROR. Intenta otra ves.");
    }
}

const login = async (req, res) => {
    
    try {
        const {email, password} = req.body;
        
        let user = await User.findOne({email}).exec();

        if (!user) return res.status(400).send("No existe usuario con el correo ingresado");

        user.comparePassword(password, (err, match) => {
            if (!match || err) return res.status(400).send("Contraseña Incorrecta");
            
            let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });

            res.json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    stripe_account_id: user.stripe_account_id,
                    stripe_seller: user.stripe_seller,
                    stripeSession: user.stripeSession,
                }
            });
        });
    } catch (error) {
        console.log("Error Login", error);
        res.status(400).send("Error al iniciar sesion");
    }
}

module.exports = {
    register,
    login
}