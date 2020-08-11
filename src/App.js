import React, {Component} from 'react';
import Axios from 'axios';
import TaskCollection from './components/TaskCollection';
import SubTaskCollection from './components/SubTaskCollection';
import './App.css';

class App extends Component {

  state = {
    chosenTaskIndex: 0,
    tasks: [],
    displayNewTaskModal: 'none',
    showNewSubTaskInput: false,
    newTaskTitle: '',
    newSubTaskTitle: '',
  }


  loadDataFromServer() {
    Axios.get('/api/tasks')
        .then(res => {
          this.setState({
            tasks: res.data,
          })
        })
  }

  componentDidMount() {
    this.loadDataFromServer()
  }

  selectTask = (index) => {
    this.setState({chosenTaskIndex: index})
  }

  onCheckedFunc = (parentTaskId, id) => {
    Axios.post(
        '/api/markSubTaskAsDone',
        {
          subTaskId: id,
          parentTaskId
        }
    ).then(res => {
      if (res.status === 200) {
        this.loadDataFromServer()
      } else {
        this.showServerErrorMsg()
      }
    })
  }

  showServerErrorMsg() {
    console.log("Ran into some kind of error!")
  }

  createNewTask = (title) => {
    this.setState({newTaskTitle: '', displayNewTaskModal: 'none'})

    let d = new Date()
    let hours12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12
    let minutes = d.getMinutes().toString()
    let suffix = d.getHours() > 12 ? 'PM' : 'AM'
    let creationDate = d.toDateString().slice(4) + ` ${hours12}:${minutes.padStart(2, '0')} ${suffix}`
    Axios.post(
        '/api/createTask',
        {title, creationDate}
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          chosenTaskIndex: this.state.tasks.length
        })
        this.loadDataFromServer()
      } else {
        this.showServerErrorMsg()
      }
    })
  }

  createNewSubTask = (id, title) => {
    Axios.post(
        '/api/createSubTask',
        {id, title}
    ).then(res => {
      if (res.status === 200) {
        this.loadDataFromServer()
      } else {
        this.showServerErrorMsg()
      }
    })
  }

  removeTask = (id) => {
    Axios.post(
        '/api/removeTask',
        {id}
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          chosenTaskIndex: this.state.chosenTaskIndex !== 0 ? this.state.chosenTaskIndex - 1 : (
              this.state.tasks.length !== 0 ? this.state.tasks.length - 2 : 0
          )
        })
        this.loadDataFromServer()
      } else {
        this.showServerErrorMsg()
      }
    })
  }

  render() {
    return (
        <div className="App">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>

          <div className="task-board" style={{
            borderRadius: '10px 0 0 10px',
            backgroundColor: 'rgb(60, 15, 114)',
          }}>
            <TaskCollection tasks={this.state.tasks} selectTaskFunc={this.selectTask}/>

            {/* Modal for taking new-task title. */}
            <div className="new-task-modal" style={{display: this.state.displayNewTaskModal}}>
              <div className="modal-content">
                <span onClick={() => {
                  this.setState({
                    displayNewTaskModal: 'none',
                    newTaskTitle: ''
                  })
                }}
                      className="modal-close-button">&times;</span>
                <div className="modal-container">
                  <input type="text" className="new-task-title-input" onChange={(e) => {
                    this.setState({
                      newTaskTitle: e.target.value,
                    })
                  }} value={this.state.newTaskTitle}/>
                  <button className="new-task-submit-button"
                          onClick={this.createNewTask.bind(this, this.state.newTaskTitle)}>Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='floating-button' onClick={() => {
            this.setState({
                  displayNewTaskModal: 'block'
                }
            )
          }}>+
          </div>
          <div className="subTask-board" style={{borderRadius: '0 10px 10px 0', backgroundColor: 'white'}}>
            <SubTaskCollection
                parentTask={this.state.tasks[this.state.chosenTaskIndex]}
                onCheckedFunc={this.onCheckedFunc}
                removeTaskFunc={this.removeTask}
            />
            <div className='subTask-item' style={{
              display: [this.state.showNewSubTaskInput || this.state.tasks.length === 0 ? 'none' : 'block'],
              color: '#888888',
            }} onClick={() => {
              this.setState({
                showNewSubTaskInput: !this.state.showNewSubTaskInput
              })
            }}>
              <i className="material-icons">edit</i>
              {' '}Add Task
            </div>
            <div style={{display: [this.state.showNewSubTaskInput ? 'block' : 'none'], padding: "10px 20px"}}>
              <input type='text' onChange={(e) => {
                this.setState({
                  newSubTaskTitle: e.target.value,
                })
              }} value={this.state.newSubTaskTitle} style={{
                marginBottom: '4px',
                outline: "none",
                fontSize: '16px',
              }}/>
              <br/>
              <button style={{
                backgroundColor: "rgb(60, 15, 114)",
                color: "white",
                outline: "none",
                border: "none",
              }} onClick={() => {
                this.createNewSubTask(this.state.tasks[this.state.chosenTaskIndex]._id, this.state.newSubTaskTitle)
                this.setState({
                  showNewSubTaskInput: false,
                  newSubTaskTitle: ''
                })
              }}>Save
              </button>
              <button style={{
                backgroundColor: "transparent",
                color: "black",
                outline: "none",
                border: "none",
              }} onClick={() => {
                this.setState({
                  showNewSubTaskInput: false,
                  newSubTaskTitle: ''
                })
              }}>Cancel
              </button>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
