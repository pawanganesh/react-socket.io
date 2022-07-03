import { createContext } from "react";

const AppContext = createContext({
  socket: null,
});

export default AppContext;
