import React, {createContext, useState, useReducer, useContext} from 'react'

export const StateContext = createContext()





export const  StateProvider =({reducer, initialState, children, roomSearch}) => {
    
    return (
        <div>
            <StateContext.Provider value={useReducer(reducer, initialState, roomSearch)}>
                {children}
           
            </StateContext.Provider>
        </div>
    )
}

export const  useStateValue =() => useContext(StateContext)

