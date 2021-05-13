import React, { createContext, useReducer, useContext } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  return (
    <div>
      <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
      </StateContext.Provider>
    </div>
  );
};

export const useStateValue = () => useContext(StateContext);
