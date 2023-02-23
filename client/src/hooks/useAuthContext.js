import { AuthContext } from "./../contexts/AuthContext";
import { useContext } from "react";

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be defined inside of AuthContextProvider");
  }

  return context;
};

export default useAuthContext;
