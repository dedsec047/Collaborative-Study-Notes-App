import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

const { Title, Text } = Typography

const initialState = { email: "", password: "" }

export default function Login() {
  
  const [state, setState] = useState(initialState)
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  
  const { setIsAppLoading } = useAuthContext()

  const navigate = useNavigate()


  let { email, password } = state

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!window.isEmail(email)) { return window.tostify("Please enter a valid emial", "error") }
    if (password.length < 6) { return window.tostify("Password must contain atleast 6 characters", "error") }

    setIsAppLoading(true)
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        navigate("/")
        const user = userCredential.user;
        console.log('user :>> ', user);
        window.tostify("user logged in", "success")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode :>> ', errorCode);
        console.log('errorMessage :>> ', errorMessage);
        window.tostify(errorMessage, "error")
        
      })
      .finally(()=>{
        setIsAppLoading(false)
      })
  }


  return (
    <main className='auth'>
      <div className='card p-3 p-md-4 w-100' >
        <Form>
          <Title>Login</Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input size='large' type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' type='password' placeholder='Enter Your Password' name='password' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type='primary' block onClick={handleSubmit} >login</Button>
            </Col>
            <Col span={24}>
              <Text type="secondary">Didn't Have An Account? <Link to="/auth/register">Sign-up</Link></Text>
            </Col>
            <Col span={24}>
              <Text type="secondary">Forgot Password? <Link to="/auth/reset">Reset Password</Link></Text>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  )
}
