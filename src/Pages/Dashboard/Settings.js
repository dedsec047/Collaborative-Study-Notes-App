import React, { useState } from 'react';
import { Button } from 'antd';
import '../../App.scss'; // Adjusted path to the correct location of App.scss

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <Button type="primary" onClick={toggleTheme}>
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </Button>
    </div>
  );
}
