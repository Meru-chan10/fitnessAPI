// Dependencies
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors")

// Environment Setup
require('dotenv').config()

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const corsOptions ={
	origin:['http://localhost:4000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Database Connection

mongoose.connect(process.env.MONGODB_STRING,{
	useNewUrlParser:true,
	useUnifiedTopology:true
})

mongoose.connection.once('open', () => console.log('Now Connected to MongoDB Atlas'))


app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};