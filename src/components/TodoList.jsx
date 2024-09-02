import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState([]);

  useEffect(() => {
    // Cargar las tareas desde el localStorage basadas en el usuario conectado
    const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.uid}`)) || [];
    setTodos(storedTodos);

    // Intentar sincronizar con Firestore
    const fetchTodos = async () => {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(todosData);
      localStorage.setItem(`todos_${user.uid}`, JSON.stringify(todosData));
    };

    fetchTodos();
  }, [user]);

  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem(`todos_${user.uid}`, JSON.stringify(todos));
  };

  const addTodo = async (text) => {
    const temporaryId = uuidv4();  // ID temporal para el nuevo todo
    const newTodo = { text, isComplete: false, userId: user.uid, id: temporaryId };

    // Actualizar localmente primero
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);

    // Intentar sincronizar con Firestore
    try {
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      const newTodoWithId = { ...newTodo, id: docRef.id };
      
      // Reemplazar el todo con el ID temporal con el ID real de Firestore
      const syncedTodos = updatedTodos.map(todo => 
        todo.id === temporaryId ? newTodoWithId : todo
      );
      setTodos(syncedTodos);
      saveTodosToLocalStorage(syncedTodos);

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
    saveTodosToLocalStorage(updatedTodos);

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
    saveTodosToLocalStorage(newTodos);

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
    saveTodosToLocalStorage(newTodos);

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
    <>
      <h2>Todolist App</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
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
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          completeTodo={completeTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </>
  );
}

export default TodoList;