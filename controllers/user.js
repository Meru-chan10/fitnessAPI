const User = require("../models/user");
const bcrypt = require("bcrypt");
let salt = bcrypt.genSaltSync(10);
const auth = require("../auth");

module.exports.registerUser = (req, res) => {
	let newUser = new User({
	  email: req.body.email,
	  password: bcrypt.hashSync(req.body.password, salt)
	})
  
	return newUser.save()
	.then((user) => res.status(201).send({ message: "Registered Successfully" }))
	.catch(err => res.status(500).send({ error: "Error in saving" }))
  }

  module.exports.loginUser = (req, res) => {

    return User.findOne({ email : req.body.email })
    .then(result => {

        if(result == null){

            return res.status(404).send({ error: "No Email Found" });

        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({ access : auth.createAccessToken(result)})
            } else {
                return res.status(401).send({ error: "Email and password do not match" });
            }
        }
    })
    .catch(err => res.status(500).send({ error: "Error in find" }))

};