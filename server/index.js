//const uuid_v4 = require('uuid').v4;
const express = require('express')
const cors = require('cors')
const uuid_v1 = require('uuid').v1
const mongoose = require('mongoose')
const TaskModel = require('./models/task-model')
const bodyParser = require('body-parser')

const app = express()
const apiPort = 5000

mongoose.connect(
    "mongodb://127.0.0.1:27017/tasksDB",
    {useUnifiedTopology: true, useNewUrlParser: true}
)
// const db = mongoose.connection

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/api/tasks', (req, res) => {
  TaskModel.find().exec((err, tasks) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      })
    }
    return res.status(200).json(tasks)
  })
})

app.post('/api/createTask', (req, res) => {
  let title = req.body.title
  let creationDate = req.body.creationDate
  let instance = new TaskModel({_id: uuid_v1(), title: title, creationDate: creationDate})
  instance.save((err, task) => {
    res.status(200).json(task)
  })
})


app.listen(apiPort)

/////    Dummy JSON
// [
// {
//   id: uuid_v4(),
//   title: "Meet up with Flat-Earth's Society",
//   creationDate: "Mar 18, 2020 08:00PM",
//   subTasks: [
//     {
//       id: uuid_v4(),
//       title: "Shake hands",
//       completed: true,
//     },
//     {
//       id: uuid_v4(),
//       title: "Remove the football disguise.",
//       completed: true,
//     },
//     {
//       id: uuid_v4(),
//       title: "Nuke 'em all!",
//       completed: false,
//     }
//   ]
// },
//     {
//       id: 2,
//       title: "Create a plan to take back Poland",
//       creationDate: "Mar 19, 2020 11:00PM",
//       subTasks: [
//         {
//           id: uuid_v4(),
//           title: "Ready the V-Tol jets",
//           completed: false,
//         },
//         {
//           id: uuid_v4(),
//           title: "Bring the might of the Galaxy",
//           completed: false,
//         }
//       ]
//     },
// ]
