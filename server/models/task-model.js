const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  _id: {type: String},
  title: {type: String},
  creationDate: {type: String},
  subTasks: {
    type: [{
      _id: {type: String, required: true},
      title: {type: String, required: true},
      completed: {type: Boolean, required: true}
    }]
  }
}, {collection: 'data'})

const TaskModel = mongoose.model('taskModel', TaskSchema)

module.exports = TaskModel


// mongoose.connect(
//     "mongodb://127.0.0.1:27017/tasksDB",
//     {useUnifiedTopology: true, useNewUrlParser: true}
// )
//
// const db = mongoose.connection;
// db.on("open", function (ref) {
//   console.log("Connected to mongo server.");
//   TaskModel.find().exec((err, tasks) => {
//     console.log(tasks)
//   })
//   console.log("Exit")
// })
