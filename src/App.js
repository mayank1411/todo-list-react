import { useState, useEffect } from "react"
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTask] = useState([])

  useEffect(() => {
    const getTasks = async () =>{
      const taskFromServer = await fetchTasks()
      setTask(taskFromServer)
    }
    getTasks()
  }, [])

// Fetch task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/task/${id}`)
  const data = await res.json()
  return data
}
//Fetch tasks
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/task')
  const data = await res.json()
  return data
}


  //Add task
  const addTask = async(task) => {
 const res = await fetch('http://localhost:5000/task', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body : JSON.stringify(task),
 })

 const data = await res.json()
 setTask([...tasks, data])

    // const id = Math.floor(Math.random() * 1000) + 1
    // const newTask = { id, ...task }
    // setTask([...tasks, newTask])

  }
  //Delete task
  const deleteTask = async(id) => {
  await fetch(`http://localhost:5000/task/${id}`,{
  method: 'DELETE',
})
    setTask(tasks.filter((task) => task.id !== id))
  }
  //Toggle Remainder
  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder}
 
    const res = await fetch(`http://localhost:5000/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(updTask)
    })
    
    const data = await res.json()

    setTask(
      tasks.map((task) =>
        task.id === id ? {
          ...task, reminder:
            data.reminder
        } : task)
    )
  }
  return (

    <div className='container'>

      <Header onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask}
        onToggle={toggleReminder}
      />)
        : ("No task to show")}
    </div>
  );
}

export default App;
