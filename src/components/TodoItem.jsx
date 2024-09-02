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
    <div>
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
        />
      ): (
        <>
          <span>{todo.text}</span>
          <button onClick={()=> deleteTodo(index)}>Eliminar</button>
        </>
      )}
    <button onClick={handleEdit}>{isEditing ? 'Guardar' : 'Editar'}</button>
    </div>
    
    </>
  )
}

export default TodoItem
