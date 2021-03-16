import React, {createContext, useReducer, useContext} from 'react'

export const StateContext = createContext()


const isLogedIn = () =>{
    if(localStorage.getItem('toke')){
      const   userLogedIn = true
    } else{
      const  userLogedIn = false
    }
}


export const  StateProvider =({reducer, initialState, children}) => {
    
    return (
        <div>
            <StateContext.Provider value={useReducer(reducer, initialState)}>
                {children}
           
            </StateContext.Provider>
        </div>
    )
}

export const  useStateValue =() => useContext(StateContext)

