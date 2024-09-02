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
        <div>
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password"
            />
            <button onClick={login}>
                {isRegistering ? "Register" : "Login"}
            </button>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Swich to login" :  "Swich to register"}
            </button>
        </div>
    )
};

export default Auth
