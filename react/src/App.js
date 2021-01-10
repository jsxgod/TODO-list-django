import React from "react";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          completed:false,
        },
        editing:false,
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.crossOutItem = this.crossOutItem.bind(this)
  };

  componentWillMount() {
    this.fetchTasks()
  }

  fetchTasks(){
    console.log('Fetching')

    fetch('http://192.168.0.13:8080/api/task-list/')
        .then(response => response.json())
        .then(data =>
            this.setState({
              todoList: data
            })
        )
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var url = 'http://192.168.0.13:8080/api/task-create/'

    if (this.state.editing === true){
      url = `http://192.168.0.13:8080/api/task-update/${ this.state.activeItem.id}/`
      this.setState({
        editing: false,
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function(error){
      console.log(error)
    })
  }

  startEdit(task){
    this.setState({
      activeItem: task,
      editing: true,
    })
  }

  deleteItem(task){
    fetch(`http://192.168.0.13:8080/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }
    }).then((response) => {
      this.fetchTasks()
    })
  }

  crossOutItem(task){
    var url = `http://192.168.0.13:8080/api/task-update/${task.id}/`

    fetch(url, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({'title': task.title, 'completed': !task.completed})
    }).then((response) => {
      this.fetchTasks()
    })
  }

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return(
        <div className="container">
          <div id="task-container">
            <div onSubmit={this.handleSubmit} id="form-wrapper">
              <form id="form">
                <div className="flex-wrapper">
                  <div style={{flex: 6}}>
                    <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Task title..."/>
                  </div>

                  <div style={{flex: 1}}>
                    <input id="submit" className="btn btn-warning" type="submit" name="Add task" value="Add" />
                  </div>
                </div>
              </form>
            </div>
            <div id="list-wrapper">
              {tasks.map(function(task, index){
                return(
                    <div key={index} className="task-wrapper flex-wrapper">
                      <div onClick={() => self.crossOutItem(task)} style={{flex: 7}}>
                        {task.completed === false ?
                            (<span>{task.title}</span>) :
                            (<span style={{textDecoration: 'line-through'}}>{task.title}</span>)}
                      </div>

                      <div style={{flex: 1}}>
                        <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info edit">Edit</button>
                      </div>

                      <div style={{flex: 1}}>
                        <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">❌</button>
                      </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>
    )
  }
}

export default App;