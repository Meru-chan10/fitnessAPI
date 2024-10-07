const { errorHandler } = require("../auth");
const Workout = require("../models/Workout")

module.exports.addWorkout = (req, res) => {
    if (!req.user || !req.body.name || !req.body.duration) {
      return res.status(400).send({ error: "User , name, and duration are required" });
    }
  
    const userId = req.user.id;
  
    Workout.findOne({ userId, name: req.body.name, duration: req.body.duration })
      .then((existingWorkout) => {
        if (existingWorkout) {
          return res.status(400).send({ error: "Workout with the same name and duration for this user already exists" });
        }
  
        let newWorkout = new Workout({
          userId,
          name: req.body.name,
          duration: req.body.duration
        });
  
        return newWorkout.save()
          .then((workout) => res.status(201).send(workout))
          .catch((err) => {
            if (err.code === 1) {
              return res.status(400).send({ error: "Workout with the same name for this user already exists" });
            }
            return res.status(500).send({ error: "Error in Save", details: err });
          });
      })
      .catch((err) => {
        return res.status(500).send({ error: "Error in Find", details: err });
      });
  }

  module.exports.getMyWorkouts = (req, res) => {

    return Workout.find()
    .then(workouts => res.status(200).send({workouts}))
    .catch(err => res.status(500).send({ error: "Error in Find", details: err}))
  
  }

  module.exports.updateWorkout = (req, res) => {
  
    let updatedWorkout = {
      name: req.body.name,
      duration: req.body.duration
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
    .then(updateWorkout => {
      if(updateWorkout) {
        res.status(200).send({ message: 'Workout updated successfully', updateWorkout });
      }
      else {
        res.status(404).send({ message: 'Course not found' });
      }

    })
    .catch(error => errorHandler(error,req,res))

  }

  module.exports.deleteWorkout = (req, res) => {

    return Workout.deleteOne({ _id: req.params.workoutId })
    .then((deleteStatus) => res.status(200).send({ 
        message: 'Workout deleted successfully'
      }))
    .catch(err => res.status(500).send({ error: "Error in Saving", details: err}))  
  }
  

module.exports.completeWorkoutStatus = (req, res) => {

    let udpateWorkout = {
      status: 'completed'
    }
  
    return Workout.findByIdAndUpdate(req.params.workoutId, udpateWorkout, { new: true })
    .then((workout) => {
      if (!workout) {
        return res.status(404).send({ message: 'Workout not found' });
      }
      return res.status(200).send({ 
        message: 'Workout status updated successfully', 
        updatedWorkout: workout 
      })
    })
    .catch(err => res.status(500).send({ error: "Error in Saving", details: err}))
  }




  