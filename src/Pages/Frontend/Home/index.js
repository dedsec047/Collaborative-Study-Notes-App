import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined, EyeOutlined, StarOutlined, StarFilled, DownOutlined } from '@ant-design/icons';
import { Avatar, Card, Row, Col, Pagination, Select, Dropdown, Menu, Button, Popover, Input } from 'antd';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { fireStore } from '../../../config/firebase';
import { useAuthContext } from '../../../contexts/AuthContext';



const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('A-Z');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 16;
  const navigate = useNavigate();
  const myUserId = 'actualUserId'; // Replace with actual user ID

  const { isAuth } = useAuthContext()

  const fetchNotes = useCallback(async () => {
    try {
      const notesCollection = collection(fireStore, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesList);
      setFilteredNotes(notesList); // Initialize filtered notes
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  const fetchUserFavorites = useCallback(async () => {
    if(!isAuth){
      // window.tostify("user not logged in", "error")
      return;
    }
    try {
      const userDocRef = doc(fireStore, 'users', myUserId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setFavorites(new Set(userData.favNotes || []));
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  }, [isAuth]);

  useEffect(() => {
    fetchNotes();
    fetchUserFavorites();
  }, [fetchNotes, fetchUserFavorites]);

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const sortedNotes = useMemo(() => {
    let sorted = [...notes];
    if (sortOption === 'A-Z') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'Date Ascending') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'Date Descending') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [notes, sortOption]);

  const filterBy = useCallback((type) => {
    let filtered;
    if (type === 'createdByMe') {
      filtered = sortedNotes.filter(note => note.createdBy === myUserId);
    } else if (type === 'favorites') {
      filtered = sortedNotes.filter(note => favorites.has(note.id));
    } else {
      filtered = sortedNotes;
    }

    setFilteredNotes(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [sortedNotes, favorites, myUserId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
    setFilteredNotes(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const menuItems = [
    { key: 'createdByMe', label: 'Created by Me' },
    { key: 'favorites', label: 'My Favorites' },
    { key: 'all', label: 'All Notes' }
  ];

  const menu = <Menu items={menuItems} onClick={({ key }) => filterBy(key)} />;

  const handleFavorite = async (noteId) => {
    const updatedFavorites = new Set(favorites);

    // Toggle favorite status
    if (updatedFavorites.has(noteId)) {
      updatedFavorites.delete(noteId);
    } else {
      updatedFavorites.add(noteId);
    }
    setFavorites(updatedFavorites);

    // Update Firestore
    try {
      const userDocRef = doc(fireStore, 'users', myUserId);
      await updateDoc(userDocRef, { favNotes: Array.from(updatedFavorites) });
    } catch (error) {
      console.error('Error updating favorite notes:', error);
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const currentNotes = filteredNotes.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <main className='mt-5 py-2'>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <Search
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: 200, marginRight: '16px' }}
        />
        <Select value={sortOption} onChange={handleSortChange} style={{ width: 150, marginRight: '16px' }}>
          <Option value="A-Z">A-Z</Option>
          <Option value="Date Ascending">Date Ascending</Option>
          <Option value="Date Descending">Date Descending</Option>
        </Select>
        <Dropdown overlay={menu}>
          <Button>
            Filter <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <Row gutter={[16, 16]}>
        {currentNotes.map(note => (
          <Col span={6} key={note.id}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <EyeOutlined key="view" onClick={() => navigate(`/note/${note.id}`)} />,
                <Popover
                  content={
                    <div>
                      <p><strong>Created by:</strong> {note.createdBy}</p>
                      <p><strong>Created at:</strong> {new Date(note.createdAt?.seconds * 1000).toLocaleString()}</p>
                      <p><strong>Last edited at:</strong> {new Date(note.lastEditedAt?.seconds * 1000).toLocaleString()}</p>
                    </div>
                  }
                  title="Note Info"
                  trigger="click"
                >
                  <InfoCircleOutlined key="info" />
                </Popover>,
                favorites.has(note.id)
                  ? <StarFilled key="favorite" onClick={() => handleFavorite(note.id)} style={{ color: 'gold' }} />
                  : <StarOutlined key="favorite" onClick={() => handleFavorite(note.id)} />
              ]}
            >
              <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={note.title}
                description={note.content}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div className="pagination-container" style={{ textAlign: 'center' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredNotes.length}
          onChange={handleChangePage}
          className='mt-4'
        />
      </div>
    </main>
  );
}
