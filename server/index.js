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
app.use(express.static('public'))
app.use(express.static('build'))
app.use(cors())

app.get('/', (req, res) => {
	res.sendFile('/build/index.html')
})

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
    if (err) {
      return res.status(404).json({
        error: 404
      })
    }
    return res.status(200).json(task)
  })
})

app.post('/api/createSubTask', (req, res) => {
  let id = req.body.id
  let title = req.body.title
  let _subTasks;
  res.setHeader('Content-Type', 'application/json');

  TaskModel.findById(id, 'subTasks').exec((err, task) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      })
    }

    _subTasks = task.subTasks
    let updatedInstance = new TaskModel({
      subTasks: [
        ..._subTasks,
        {
          _id: uuid_v1(),
          title,
          completed: false
        }
      ]
    })
    // Do the upsert, which works like this: If no Task document exists with `id`
    TaskModel.updateOne({_id: id}, updatedInstance, {upsert: true}, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        })
      }
    })

    return res.status(200).json({
      success: true
    })
  })
})


app.post('/api/markSubTaskAsDone', (req, res) => {
  let subTaskId = req.body.subTaskId
  let parentTaskId = req.body.parentTaskId
  TaskModel.findById(parentTaskId, 'subTasks').exec((err, task) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      })
    }

    let subTasks = task.subTasks
    for (let i = 0; i < subTasks.length; i++) {
      if (subTasks[i]._id === subTaskId) {
        subTasks[i].completed = !subTasks[i].completed
        break
      }
    }

    let updatedInstance = TaskModel({subTasks})
    TaskModel.updateOne({_id: parentTaskId}, updatedInstance, {upsert: true}, err => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        })
      }
    })

    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/removeTask', (req, res) => {
  let id = req.body.id
  TaskModel.findByIdAndRemove(id).exec((err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      })
    }
    return res.status(200).json({
      success: true
    })
  })
})


app.listen(apiPort)
console.log(`Server started hosting at http://localhost:${apiPort}`)

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
