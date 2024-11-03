import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { auth, fireStore } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'

const Auth = createContext()

const initialState = { isAuth: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGGED_IN": 
            return { isAuth: true, user: { ...payload.user, id: payload.uid } } // Adding uid
        case "SET_LOGGED_OUT": 
            return initialState
        default: 
            return state
    }
}

export default function AuthContext({ children }) {
    const [isAppLoading, setIsAppLoading] = useState(false)
    const [currentUser , setCurrentUser] =useState("")
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setIsAppLoading(true)
            if (user) {
                const uid = user.uid;
                console.log('uid :>> ', uid);
                readUserData(user)
                console.log('data was fetched from the server');
            } else {
                console.log('something went wrong while logging in');
            }
            setTimeout(() => {
                setIsAppLoading(false)
            }, 1500)
        });
    }, [])

    const readUserData = async (user) => {
        const docSnap = await getDoc(doc(fireStore, "users", user.uid));
        console.log('docSnap :>> ', docSnap);
        if (docSnap.exists()) {
            let userData = docSnap.data()
            setCurrentUser(userData.fullName)
            dispatch({ type: "SET_LOGGED_IN", payload: { user: userData, uid: user.uid } })
            console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    return (
        <Auth.Provider value={{ ...state, dispatch, isAppLoading, setIsAppLoading, currentUser }}>
            {children}
        </Auth.Provider>
    )
}

export const useAuthContext = () => useContext(Auth)
