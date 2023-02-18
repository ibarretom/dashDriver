import { createContext, useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "../plugins/firebase";

export const AuthContext = createContext({});

export function Auth({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  async function createUser({ email, password }) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function signIn({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setisLoggedIn(true);

      } else {
        setUser(null);
        setisLoggedIn(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ createUser, signIn, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}