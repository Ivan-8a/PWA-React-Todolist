import TodoList from './components/TodoList';
import Auth from './components/Auth';
import {auth, onAuthStateChanged, signOut} from "./components/firebase";
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
      } else {
        setUser(null)
      }
    });
    return() => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sesion cerrada")
    }catch (error) {
      console.log("Error al cerrar sesion", error)
    }
  };
  return <>
    {user ? (
      <>
        <button className='boton-cerrar-sesion' onClick={handleSignOut}>Cerrar sesion</button>
        <TodoList user={user}></TodoList>
      </>
    ):(
        <Auth setUser={setUser}></Auth>
    )}
  </>
}

export default App;
