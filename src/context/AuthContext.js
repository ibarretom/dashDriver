import { createContext, useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from "../plugins/firebase";

export const AuthContext = createContext({});

export function Auth({ children }) {
  const [user, setUser] = useState(null);
  const [isLogIn, setIsLogIn] = useState(false);

  function createUser({ email, password }) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function updateUserName(name) {
    return updateProfile(auth.currentUser, {
      displayName: name
    })
  }

  function signIn({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLogIn(true);

      } else {
        setUser(null);
        setIsLogIn(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ createUser, signIn, updateUserName, isLogIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}