import { createContext, useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode";

const INITIAL_STATE = {
  user: null,
  isAdmin: false,
  loadingUser: false,
  errorUser: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        user: jwtDecode(action.payload),
        isAdmin: jwtDecode(action.payload).isAdmin,
        loadingUser: false,
        errorUser: null,
      };
    case "LOGOUT":
      return {
        user: null,
        isAdmin: false,
        loadingUser: false,
        errorUser: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      const user = jwtDecode(token);

      if (user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: token });
      }
    } catch (err) {
      localStorage.clear("token");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAdmin: state.isAdmin,
        loadingUser: state.loadingUser,
        errorUser: state.errorUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
