import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Card, message } from 'antd';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { fireStore } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: (label) => `${label} is required!`,
  types: {
    email: (label) => `${label} is not a valid email!`,
    number: (label) => `${label} is not a valid number!`,
  },
  number: {
    range: (label, min, max) => `${label} must be between ${min} and ${max}`,
  },
};

const Account = () => {
  const { user } = useAuthContext();
  const [notesCount, setNotesCount] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    age: null,
    website: '',
    introduction: ''
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user.uid) {
        const userDoc = await getDoc(doc(fireStore, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
        
        const notesQuery = query(collection(fireStore, 'notes'), where('createdBy.uid', '==', user.uid));
        const notesSnapshot = await getDocs(notesQuery);
        setNotesCount(notesSnapshot.size);
      }
    };

    fetchUserDetails();
  }, [user.uid]);

  const onFinish = async (values) => {
    try {
      await updateDoc(doc(fireStore, 'users', user.uid), {
        ...values.user
      });
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Error updating profile: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <Card title="Account Details">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          initialValues={{
            user: {
              name: userInfo.name,
              email: userInfo.email,
              age: userInfo.age,
              website: userInfo.website,
              introduction: userInfo.introduction
            }
          }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={['user', 'name']}
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'email']}
            label="Email"
            rules={[
              {
                type: 'email',
                required: true
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'age']}
            label="Age"
            rules={[
              {
                type: 'number',
                min: 15,
                max: 99,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={['user', 'website']} label="Website">
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'introduction']} label="Introduction">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 16,
              offset: 8,
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <p><strong>Total Notes Created: </strong>{notesCount}</p>
      </Card>
    </div>
  );
};

export default Account;
