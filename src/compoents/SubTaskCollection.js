import React, {Component} from 'react'

class SubTaskItem extends Component {
  render() {
    return (
        <div className='subTask-item' style={{textDecoration: this.props.task.completed ? 'line-through' : 'none'}}>
          <input
              type="checkbox"
              checked={this.props.task.completed}
              onChange={this.props.onCheckedFunc.bind(this, this.props.parentTaskId, this.props.task._id)}
          />
          {' '}
          {this.props.task.title}
        </div>
    )
  }
}

class SubTaskCollection extends Component {
  render() {
    // Check if tasks are empty
    if (this.props.parentTask === undefined)
      return <div/>

    return (
        <div>
          <div className="task-title">
            {this.props.parentTask.title}
          </div>
          <div className="date-time">
            {this.props.parentTask.creationDate}
            <span onClick={this.props.removeTaskFunc.bind(this, this.props.parentTask._id)}><i className="material-icons" style={{
              float: "right",
              cursor: "pointer"
            }}>delete</i></span>
          </div>
          <hr style={{backgroundColor: "rgb(173, 173, 173)"}}/>
          {this.props.parentTask.subTasks.map(task =>
              (<SubTaskItem
                  key={task._id}
                  task={task}
                  parentTaskId={this.props.parentTask._id}
                  onCheckedFunc={this.props.onCheckedFunc}/>))}
        </div>
    )
  }
}

export default SubTaskCollection
