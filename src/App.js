import React, { useState, useEffect  } from "react";
import './App.css';
import DittoManager from "./Ditto"
import { Ditto, LiveQuery, Document } from "@dittolive/ditto";

let ditto: Ditto
let liveQuery: LiveQuery

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

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

  function onAddClick (){
    if (!ditto) return setError('No ditto.')
    setError('')
    ditto.store.collection('tasks').upsert({
      "name": 'task1'
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          { tasks.map(task => {
							return <div> {task.name} </div>
						})
					}
          {error && <p style={{"color": "red"}}>{error}</p>}
          <button onClick={onAddClick}>+</button>
        </div>
      </header>
    </div>
  );
}

export default App;
