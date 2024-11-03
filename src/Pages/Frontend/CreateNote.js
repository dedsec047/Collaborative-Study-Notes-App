import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { fireStore } from '../../config/firebase';
import { Form, Input, Button, Select } from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const { TextArea } = Input;
const { Option } = Select;

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();
  const { user, currentUser } = useAuthContext();

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error('User ID is undefined');
      return;
    }

    const uid = Math.random().toString(); 
    try {
      const newNote = {
        noteId: uid,
        title,
        content,
        subject,
        createdBy: currentUser,
        lastEditedBy: "",
        lastEditedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        collaborators: [""],
      };
      await setDoc(doc(fireStore, "notes", uid), newNote);
      window.tostify("Note created successfully", "success")
      navigate('/');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <main>

    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2>Create New Note</h2>
        </div>
        <div className="card-body">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Item>
            <Form.Item label="Content">
              <TextArea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Subject">
              <Select value={subject} onChange={(value) => setSubject(value)} required>
                <Option value="Math">Math</Option>
                <Option value="Science">Science</Option>
                <Option value="History">History</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Note
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
    </main>
  );
};

export default CreateNote;
