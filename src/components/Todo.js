export default function Todo(props) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input
					type="checkbox"
					defaultChecked={props.completed}
					onChange={() => props.toggleTaskCompleted(props.id)}
				/>
        <label className="todo-label">
          {props.name} 
        </label>
      </div>
    </li>
  );
}
