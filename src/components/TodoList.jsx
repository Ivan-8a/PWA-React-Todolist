import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDocs, collection, addDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs)
      const todosData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(todosData)
      setTodos(todosData);
    };
    fetchTodos();
  }, [user]);

  const addTodo = async (text) => {
    const newTodo = { text, isComplete: false, userId: user.uid };
    const docRef = await addDoc(collection(db, "todos"), newTodo);
    const newTodoWithId = { ...newTodo, id: docRef.id };

    // Agregar el nuevo todo al estado actual
    setTodos([...todos, newTodoWithId]);

    // Guardar en localStorage
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    storedTodos.push(newTodoWithId);
    localStorage.setItem("todos", JSON.stringify(storedTodos));

    console.log(`document added: ${newTodo.text}, ID: ${docRef.id}`);
};


  const deleteTodo = async (index) => {
    const toDelete = todos[index];
    await deleteDoc(doc(db, "todos", toDelete.id));
    setTodos(todos.filter((_, i)=> i !== index));
    console.log("document deleted")
  };

  const completeTodo = async (index) => {
    const updatedTodo = {...todos[index], isComplete: !todos[index].isComplete};
    await updateDoc(doc(db, "todos", updatedTodo.id), updatedTodo)
    const newTodos = [...todos];
    newTodos[index] = updatedTodo
    setTodos(newTodos);
    console.log(`document updated, isComplete: ${newTodos[index].isComplete}`);
  };

  const editTodo = async (index, newText) => {
    const updatedTodo = {...todos[index], text: newText};
    await updateDoc(doc(db, "todos", updatedTodo.id), updatedTodo)
    const newTodos = [...todos];
    newTodos[index] = updatedTodo
    setTodos(newTodos);
    console.log(`document edited, ID: ${updatedTodo.id}`)
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
