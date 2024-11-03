import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { fireStore } from '../../config/firebase';
import { Button, Input, List } from 'antd';
import { Comment } from '@ant-design/compatible';
import { useAuthContext } from '../../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const docRef = doc(fireStore, 'notes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() });
          setNewContent(docSnap.data().content);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };
    fetchNote();
  }, [id]);

  const handleEdit = async () => {
    try {
      const docRef = doc(fireStore, 'notes', id);
      await updateDoc(docRef, {
        content: newContent,
        lastEditedBy: user.fullName,
        lastEditedAt: serverTimestamp(),
        collaborators: arrayUnion(user.fullName)
      });
      setIsEditing(false);
      setNote(prev => ({ ...prev, content: newContent }));
      window.tostify("Note edited successfully", "success");
    } catch (error) {
      console.error('Error updating note:', error);
      window.tostify(error, "error");
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const comment = {
        author: user.fullName,
        content: newComment,
        datetime: new Date()
      };

      const docRef = doc(fireStore, 'notes', id);
      await updateDoc(docRef, {
        comments: arrayUnion(comment)
      });

      setNewComment('');
      setNote(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <main className="container mt-5">
      <div className="card shadow-sm">
        {note ? (
          <>
            <div className="card-header">
              <h1 className="text-center">{note.title}</h1>
            </div>
            <div className="card-body">
              {isEditing ? (
                <Input.TextArea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="mb-3"
                />
              ) : (
                <p>{note.content}</p>
              )}
              {isEditing ? (
                <Button onClick={handleEdit} type="primary">Save</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} type="primary">Edit</Button>
              )}

              <div className="mt-4 card-header">
                
                <h3 className="mt-4 text-center">Moderators</h3>
                <List
                  dataSource={note.collaborators || []}
                  renderItem={collaborator => (
                    <List.Item>
                      {collaborator}
                    </List.Item>
                  )}
                />
              </div>
              
              <h2 className="mt-4 text-center">Comments</h2>
              
              <List
                dataSource={note.comments || []}
                renderItem={comment => (
                  <Comment
                    author={comment.author}
                    content={comment.content}
                    datetime={new Date(comment.datetime).toLocaleString()}
                  />
                )}
                className="mb-3"
              />
              <div className="mt-3">
                <Input.TextArea
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <Button onClick={handleAddComment} type="primary" className="mt-2">
                  Add Comment
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="card-body">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default NoteDetail;
