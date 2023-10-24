import React, { useState, useEffect  } from "react";
import './App.css';
import Todo from "./components/Todo"
import DittoManager from "./Ditto"
import { Ditto, LiveQuery, Document } from "@dittolive/ditto";

let ditto: Ditto
let liveQuery: LiveQuery

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
	const [task, setTask] = useState('')

  useEffect(() => {
    async function startDitto() {
      ditto = DittoManager()
      liveQuery = ditto.store
				.collection('tasks')
				.findAll()
				.observeLocal((items, ev) => {
					setTasks(items.map(item => {
						//console.log('item.value: ', item.value)
						return {
							"id": item.value._id,
							"name": item.value.name,
							"completed": item.value.completed
						}
					}))
					//console.log('items: ', items)
				})
    }
    startDitto()
    return () => {
      liveQuery?.stop()
    }
  }, []);

  function handleSubmit (e){
		e.preventDefault()
    if (!ditto) return setError('No ditto.')
    setError('')
		//console.log('name:', task)
    ditto.store.collection('tasks').upsert({
      "name": task,
			"completed": false
    })
  }
	
	function toggleTaskCompleted(id) {
		ditto.store.collection('tasks')
		.findByID(id).update(doc => {
			let isCompleted = doc.value.completed
			doc.at("completed").set(!isCompleted)
		})
		const updatedTasks = tasks.map(task => {
			if (id === task.id) {
				return { ...task, completed: !task.completed }
			}
			return task
		})
		setTasks(updatedTasks)
	}

	function getCompleted() {
		const c = ditto.store
			.collection('tasks')
			.find("completed === false")
		console.log('c: ', c)
	}

	const taskList = tasks.map(task => (
		<Todo
			name={task.name}
			id={task.id}
			toggleTaskCompleted={toggleTaskCompleted}
		/>
	))

  return (
    <div className="App">
      <header className="App-header">
				<h3>Tasks</h3>
        <div>
					<ul>
						{taskList}
					</ul>
          {error && <p style={{"color": "red"}}>{error}</p>}
					<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={task}
						onChange={(e) => setTask(e.target.value)}
					/>
					<button type="submit">
						Add Task
					</button>
					<div>
						<button
							type="button"
							onClick={getCompleted}>
							Show Completed Tasks
						</button>
					</div>
					</form>
        </div>
      </header>
    </div>
  );
}

export default App;

