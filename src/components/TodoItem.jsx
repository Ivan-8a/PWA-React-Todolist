import { useState } from "react"

function TodoItem ({todo, completeTodo, index, deleteTodo, editTodo}){

  const[isEditing, setIsEditing] = useState(false);
  const[newText, setNewText] = useState(todo.text)

  const handleEdit = () => {
    if(isEditing) {
      editTodo(index, newText)
    }
    setIsEditing(!isEditing)
  }

  return (
    <>
    <div className="todo-item">
  <input
    type="checkbox"
    checked={todo.isComplete}
    onChange={() => completeTodo(index)}
  />
  {isEditing ? (
    <input
      type="text"
      value={newText}
      onChange={(e) => setNewText(e.target.value)}
      className="edit-input"
    />
  ) : (
    <>
      <span className={todo.isComplete ? "completed" : ""}>{todo.text}</span>
      <button className="delete-btn" onClick={() => deleteTodo(index)}>
        Eliminar
      </button>
    </>
  )}
  <button className="edit-btn" onClick={handleEdit}>
    {isEditing ? "Guardar" : "Editar"}
  </button>
  </div>
    </>
  )
}

export default TodoItem
