import React, { useState, useEffect, useCallback } from 'react';
import { Button, List, Card, message, Popconfirm, Pagination } from 'antd';
import { doc, getDocs, deleteDoc, collection, query, where } from 'firebase/firestore';
import { fireStore } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

export default function MyAllNotes() {
  const { user } = useAuthContext();
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchNotes = useCallback(async () => {
    try {
      const q = query(collection(fireStore, 'notes'), where("createdBy", "==", user.fullName));
      const notesSnapshot = await getDocs(q);
      const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesList);
    } catch (error) {
      message.error("Error fetching notes: " + error.message);
    }
  }, [user.fullName]);

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(fireStore, 'notes', noteId));
      setNotes(notes.filter(note => note.id !== noteId));
      message.success("Note deleted successfully!");
      window.tostify("Note deleted successfully!", "success")
    } catch (error) {
      message.error("Error deleting note: " + error.message);
      window.tostify("not deleted", "success")
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentNotes = notes.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container mt-5">
      <h1 className="text-center">My Notes</h1>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={currentNotes}
        renderItem={note => (
          <List.Item>
            <Card title={note.title}>
              <p>{note.content}</p>
              <Popconfirm
                title="Are you sure you want to delete this note?"
                onConfirm={() => handleDelete(note.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            </Card>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={notes.length}
        onChange={handleChangePage}
        className='mt-4'
        style={{ textAlign: 'center' }}
      />
    </div>
  );
}
