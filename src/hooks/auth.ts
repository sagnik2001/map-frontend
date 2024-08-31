import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";

export type AuthState = "UNKNOWN" | "LOGGED_IN" | "LOGGED_OUT";
export type UserType = User | null;

export default function useFbAuth() {
  const [authState, setAuthState] = useState<AuthState>("UNKNOWN");
  const [user, setUser] = useState<UserType>(auth?.currentUser || null);
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setUser(auth.currentUser);
      setAuthState(!!auth.currentUser ? "LOGGED_IN" : "LOGGED_OUT");
    });
  }, []);
  return { authState, user };
}
