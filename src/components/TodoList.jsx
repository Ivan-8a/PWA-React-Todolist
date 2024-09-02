import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState([]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    if (storedTodos.length > 0) {
      setTodos(storedTodos);
    } else {
      const fetchTodos = async () => {
        const q = query(collection(db, "todos"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const todosData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTodos(todosData);
        localStorage.setItem("todos", JSON.stringify(todosData));
      };
      fetchTodos();
    }
  }, [user]);

  const addTodo = async (text) => {
    const temporaryId = uuidv4();  // ID temporal para el nuevo todo
    const newTodo = { text, isComplete: false, userId: user.uid, id: temporaryId };

    // Actualizar localmente primero
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    // Intentar sincronizar con Firestore
    try {
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      const newTodoWithId = { ...newTodo, id: docRef.id };
      
      // Reemplazar el todo con el ID temporal con el ID real de Firestore
      const syncedTodos = updatedTodos.map(todo => 
        todo.id === temporaryId ? newTodoWithId : todo
      );
      setTodos(syncedTodos);
      localStorage.setItem("todos", JSON.stringify(syncedTodos));

      console.log(`Document added: ${newTodo.text}, ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      
      // Si falla, almacenar en la cola para reintento
      setOfflineQueue([...offlineQueue, newTodo]);
      console.log("Document added to offline queue");
    }
  };

  const deleteTodo = async (index) => {
    const toDelete = todos[index];
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    try {
      await deleteDoc(doc(db, "todos", toDelete.id));
      console.log("Document deleted");
    } catch (error) {
      console.error("Error deleting document: ", error);
      // Manejar el error si es necesario
    }
  };

  const completeTodo = async (index) => {
    const updatedTodo = { ...todos[index], isComplete: !todos[index].isComplete };
    const newTodos = [...todos];
    newTodos[index] = updatedTodo;
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));

    try {
      await updateDoc(doc(db, "todos", updatedTodo.id), updatedTodo);
      console.log(`Document updated, isComplete: ${newTodos[index].isComplete}`);
    } catch (error) {
      console.error("Error updating document: ", error);
      // Manejar el error si es necesario
    }
  };

  const editTodo = async (index, newText) => {
    const updatedTodo = { ...todos[index], text: newText };
    const newTodos = [...todos];
    newTodos[index] = updatedTodo;
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));

    try {
      await updateDoc(doc(db, "todos", updatedTodo.id), updatedTodo);
      console.log(`Document edited, ID: ${updatedTodo.id}`);
    } catch (error) {
      console.error("Error editing document: ", error);
      // Manejar el error si es necesario
    }
  };

  const [inputText, setInputText] = useState("");

  return (
    <div className="app-container">
      <div className="todo-list">
        <h2>Todolist App</h2>
        <input className="task-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="add-task-button"
          onClick={() => {
            if (inputText.trim()) {
              addTodo(inputText);
              setInputText("");
            }
          }}
        >
          ADD task
        </button>
        {todos.map((todo, index) => (
          <div key={todo.id} className="todo-item">
            <div className="task">
              <input
                type="checkbox"
                checked={todo.isComplete}
                onChange={() => completeTodo(index)}
              />
              <span>{todo.text}</span>
            </div>
            <div className="buttons">
              <button onClick={() => editTodo(index, "New text here")}>Edit</button>
              <button onClick={() => deleteTodo(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
