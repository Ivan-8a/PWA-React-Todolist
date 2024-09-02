import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Auth({setUser}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const login = async () => {
        try{
            const userCredential = isRegistering
            ? await createUserWithEmailAndPassword(auth, email, password)
            : await signInWithEmailAndPassword(auth, email, password);

            setUser(userCredential.user);
        } catch(error) {
            console.log("Error en la autenticacion", error)
        }
    }

    return (
        <div className="login-form">
          <h2>{isRegistering ? "Registrarse" : "Iniciar sesión"}</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"   
    
          />
          <button   
     onClick={login}>
            {isRegistering ? "Registrarse" : "Iniciar sesión"}
          </button>
          <button className="switch-button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Iniciar sesión" : "Registrarse"}
          </button>
        </div>
      );
};

export default Auth
