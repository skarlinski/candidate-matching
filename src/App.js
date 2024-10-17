// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Candidates from './components/Candidates';
import Jobs from './components/Jobs';
import Matching from './components/Matching';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Candidate Matching Demo
          </Typography>
          <Button color="inherit" component={Link} to="/candidates">Candidates</Button>
          <Button color="inherit" component={Link} to="/jobs">Job Descriptions</Button>
          <Button color="inherit" component={Link} to="/matching">Matching</Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Candidates />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/matching" element={<Matching />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
