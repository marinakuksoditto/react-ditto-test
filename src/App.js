import React, { useState, useEffect  } from "react";
import './App.css';
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
						console.log('item.value: ', item.value)
						return {
							"id": item.value._id,
							"name": item.value.name,
							"completed": item.value.isCompleted
						}
					}))
					console.log('items: ', items)
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
		console.log('name:', task)
    ditto.store.collection('tasks').upsert({
      "name": task,
			"isCompleted": false
    })
  }

  return (
    <div className="App">
      <header className="App-header">
				<h3>Tasks</h3>
        <div>
          { tasks.map(task => {
							//turn {task.name} & {task.id} into taskList
							return <div> {task.name} {task.id} </div>
						})
					}
          {error && <p style={{"color": "red"}}>{error}</p>}
					<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={task}
						onChange={(e) => setTask(e.target.value)}
					/>
					<button type="submit" className="btn btn__primary btn__1g">
						Add
					</button>
					</form>
        </div>
      </header>
    </div>
  );
}

export default App;
