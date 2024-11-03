import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Make sure to import Link
import { auth, fireStore } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const { Title, Text } = Typography;

const initialState = { email: "", password: "", confirmPassword: "" };

export default function ResetPassword() {
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = state;

    if (password !== confirmPassword) {
      return message.error("Passwords do not match");
    }

    try {
      const userDoc = await getDoc(doc(fireStore, "users", email));
      if (userDoc.exists()) {
        const user = auth.currentUser;
        await updatePassword(user, password);
        await updateDoc(doc(fireStore, "users", email), { password });
        message.success("Password reset successfully");
        navigate("/auth/login");
      } else {
        message.error("User with this email does not exist");
      }
    } catch (error) {
      console.error("Error resetting password", error);
      message.error("Error resetting password");
    }
  };

  return (
    <main className='auth'>
      <div className='card p-3 p-md-4 w-100'>
        <Form>
          <Title>Reset Password</Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input size='large' type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' placeholder='Enter Your New Password' name='password' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' placeholder='Confirm Your New Password' name='confirmPassword' onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type='primary' block onClick={handleSubmit}>Reset Password</Button>
            </Col>
            <Col span={24}>
              <Text type="secondary">Remembered your password? <Link to="/auth/login">Log In</Link></Text>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  );
}
