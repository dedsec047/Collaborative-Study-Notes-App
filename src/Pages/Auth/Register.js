import React, { useState } from 'react';
import { auth, fireStore } from '../../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const { Title, Text } = Typography;

const initialState = { fullName: "", email: "", password: "", confirmPassword: "" };

export default function Register() {
  const [state, setState] = useState(initialState);
  const handleChange = (e) => { setState((s) => ({ ...s, [e.target.name]: e.target.value })) };

  const navigate = useNavigate();
  let { fullName, email, password, confirmPassword } = state;

  const handleSubmit = (e) => {
    e.preventDefault();

    fullName = fullName.trim();

    if (fullName.length < 3) { return window.tostify("Please Enter Full Name", "error") }
    if (!window.isEmail(email)) { return window.tostify("Please Enter A Valid Email", "error") }
    if (password.length < 6) { return window.tostify("Password Must Be Atleaset Of 6 Chracters", "error") }
    if (confirmPassword !== password) { return window.tostify("Password Didn't Match", "error") }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log('user :>> ', user);
        handleCreateUser(user);
        window.tostify("New User Created", "success");
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode :>> ', errorCode);
        console.log('errorMessage :>> ', errorMessage);
        // ..
      });
  };

  const handleCreateUser = async ({ email, uid }) => {
    let userData = { uid, fullName, email, status: "active", favNotes: [], timeCreated: serverTimestamp() };
    console.log('userData :>> ', userData);

    try {
      await setDoc(doc(fireStore, "users", userData.uid), userData);
    } catch (e) {
      console.error("something went wrong while storing user data", e);
    }
  };

  return (
    <main className='auth'>
      <div className='card p-3 p-md-4 w-100'>
        <Form>
          <Title>Register</Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input size='large' type='text' placeholder='Enter Your Full Name' name='fullName' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input size='large' type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' placeholder='Enter Your Password' name='password' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' placeholder='Confirm Password' name='confirmPassword' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type='primary' block onClick={handleSubmit}>Register</Button>
            </Col>
            <Col span={24}>
              <Text type="secondary">Already Have An Account? <Link to="/auth/login">Log In</Link></Text>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
}
