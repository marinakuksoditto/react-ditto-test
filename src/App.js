import React, { useState, useEffect  } from "react";
import './App.css';
import DittoManager from "./Ditto"
import { Ditto, LiveQuery, Document } from "@dittolive/ditto";

let ditto: Ditto
let liveQuery: LiveQuery

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
	const [name, setName] = useState('')

  useEffect(() => {
    async function startDitto() {
      
      ditto = DittoManager()
      liveQuery = ditto.store
				.collection('tasks')
				.findAll()
				.observeLocal((items, ev) => {
					setTasks(items.map(item => {
						return item.value
					}))
					console.log(items)
				})
    }
    
    startDitto()
    return () => {
      liveQuery?.stop()
    }
  }, []);

  function onClickPlus (){
    if (!ditto) return setError('No ditto.')
    setError('')
    ditto.store.collection('tasks').upsert({
      "name": name
    })
  }

  function handleSubmit (e){
		e.preventDefault()
    if (!ditto) return setError('No ditto.')
    setError('')
		console.log('name:', name)
    ditto.store.collection('tasks').upsert({
      "name": name
    })
  }

  return (
    <div className="App">
      <header className="App-header">
				<h3>Tasks</h3>
        <div>
          { tasks.map(task => {
							return <div> {task.name} </div>
						})
					}
          {error && <p style={{"color": "red"}}>{error}</p>}
          <button onClick={onClickPlus}>+</button>
					<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
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
