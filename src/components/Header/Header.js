import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'

import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai"
import { FileAddOutlined } from "@ant-design/icons"

export default function Header() {
    
    const { isAuth, user, dispatch } = useAuthContext()

    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth).then(() => {
            dispatch({ type: "SET_LOGGED_OUT", payload: "" })
            window.tostify("user logout", "danger")
        }).catch((error) => {
            window.tostify("something went wrong while user logout", "warning")
            console.log('error :>> ', error)
        })
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Colab-Study</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">All Notes</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/About" className="nav-link">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Contact" className="nav-link">Contact Us</Link>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <div className="me-2">
                                { isAuth
                                 ?   <button className='btn btn-info' onClick={() => navigate("/create")}><FileAddOutlined /> create</button>
                                 :  <></>
                                }
                                
                            </div>
                            <div className="d-flex align-items-center">
                                {isAuth
                                    ? <button className="btn btn-danger" onClick={handleLogout}><AiOutlineLogout className='me-2' />Logout</button>
                                    : <button className="btn btn-success" onClick={() => navigate("/auth/login")}><AiOutlineLogin className='me-2' />Login</button>
                                }
                                <p className='text-center m-2 text-white'>
                                    <Link to="/dashboard" className='nav-link'>{isAuth ? `hi! ${user.fullName}` : ""}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
