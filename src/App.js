import React, { useState, useEffect  } from "react";
import './App.css';
import Todo from "./components/Todo"
import Completed from "./components/Completed"
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
		if (task.length !==0) {
			ditto.store.collection('tasks').upsert({
				"name": task,
				"completed": false
			})
			setTask("")
		}
  }
	
	function getCompleted (task){
		if (task.completed === true) {
			return task.name
		}
	}

	const showCompleted = tasks.filter(getCompleted)
		.map(task => ( 
			<Completed
				name={task.name}
			/>
		))

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

	const taskList = tasks.map(task => (
		<Todo
			name={task.name}
			id={task.id}
			toggleTaskCompleted={toggleTaskCompleted}
		/>
	))

	async function clearTasks() {
		//mark items as deleted in ditto
		setTasks([])
	}

  return (
    <div className="App">
      <header className="App-header">
			<div className="content">
				<h3>Tasks</h3>
        <div className="tasklist">
					<ul>
						{taskList}
					</ul>
				</div>
				<div>
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
							onClick={clearTasks}>
							Clear Tasks
						</button>
					</div>
					</form>
					<div>
						<h3>Completed Tasks</h3>
						<ul>
							{showCompleted}
						</ul>
					</div>
				</div>
			</div>
      </header>
    </div>
  );
}

export default App;

