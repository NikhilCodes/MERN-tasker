import React, {Component} from 'react';

class TaskItem extends Component {

  render() {
    let nSubTasksCompleted = 0;
    this.props.task.subTasks.forEach((subTask) => {
      if (subTask.completed) {
        nSubTasksCompleted++
      }

    })
    return (
        <div className="task-item" onClick={this.props.selectTaskFunc.bind(this, this.props.index)}>
          {this.props.task.title}

          <div style={{height: '4px'}}/>

          <div style={{
            color: "grey",
            fontSize: 14,
            fontFamily: "'Josefin Sans', sans-serif"
          }}>
            {this.props.task.creationDate}
          </div>

          <div style={{height: '7px'}}/>

          <div style={{
            color: '#14d5ee',
            fontSize: '14px',
            fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
            letterSpacing: '2px',
          }}>
            {nSubTasksCompleted}/{this.props.task.subTasks.length}
          </div>
        </div>
    )
  }
}

class TaskCollection extends Component {
  render() {
    let index = 0
    let taskTiles = this.props.tasks.map(task => {
      return (<TaskItem
          key={task._id}
          task={task}
          selectTaskFunc={this.props.selectTaskFunc}
          index={index++}/>)
    })
    taskTiles.push((<div key="last-space" style={{height: '10vh'}}/>))
    return taskTiles;
  }
}

export default TaskCollection;