export default function Todo(props) {
  return (
    <li>
      <div className="cb">
        <label>
          {props.name} 
        </label>
        <input
					type="checkbox"
					defaultChecked={props.completed}
					onChange={() => props.toggleTaskCompleted(props.id)}
				/>
      </div>
    </li>
  );
}
