import React from 'react'
import {Button} from '@material-ui/core'
import './Login.css'
import {auth, provider} from './firebase'
import { actionTypes } from './reducer'
import {useStateValue} from './StateProvider'


function Login() {

    const [{}, dispatch] = useStateValue()

    const signIn =() =>{
        auth
        .signInWithPopup(provider)
        .then(result =>
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user,
                token: localStorage.setItem('token', result.credential.accessToken) 
            })
        )
        
        .catch(error => alert(error.message))
    }

    return (
        <div className="login">
           <div className="login_container">
             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
             <div className="login_text">
                <h1>Sighn in to WhattsApp</h1>
             </div>
             <Button  type="submit" onClick={signIn}>
                 Sign In With Google
             </Button>
           </div>
        </div>
    )
}

export default Login
