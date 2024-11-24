// src/components/CandidateEditModal.js

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function CandidateEditModal({ open, onClose, candidate, onSave }) {
  const [editedCandidate, setEditedCandidate] = useState({ ...candidate });

  useEffect(() => {
    setEditedCandidate({ ...candidate });
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCandidate({ ...editedCandidate, [name]: value });
  };

  const handleSave = () => {
    // Validate inputs if necessary
    onSave(editedCandidate);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-candidate-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="edit-candidate-modal-title" variant="h5" component="h2">
          Edit Candidate
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={editedCandidate.name}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={editedCandidate.category}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value="Frontend Development">Frontend Development</MenuItem>
            <MenuItem value="Backend Development">Backend Development</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
            <MenuItem value="Embedded Systems">Embedded Systems</MenuItem>
            <MenuItem value="Software Engineering">Software Engineering</MenuItem>
            <MenuItem value="Leadership">Leadership</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Company"
          name="company"
          value={editedCandidate.company}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Current Position"
          name="currentPosition"
          value={editedCandidate.currentPosition}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="seniority-level-label">Seniority Level</InputLabel>
          <Select
            labelId="seniority-level-label"
            name="seniorityLevel"
            value={editedCandidate.seniorityLevel}
            label="Seniority Level"
            onChange={handleChange}
          >
            <MenuItem value={1}>1 - Junior</MenuItem>
            <MenuItem value={2}>2 - Mid-level</MenuItem>
            <MenuItem value={3}>3 - Senior</MenuItem>
            <MenuItem value={4}>4 - Lead</MenuItem>
            <MenuItem value={5}>5 - Executive</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Years of Experience"
          name="yearsOfExperience"
          type="number"
          value={editedCandidate.yearsOfExperience}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="education-quality-label">Education Quality</InputLabel>
          <Select
            labelId="education-quality-label"
            name="educationQuality"
            value={editedCandidate.educationQuality}
            label="Education Quality"
            onChange={handleChange}
          >
            <MenuItem value={1}>1 - No Education</MenuItem>
            <MenuItem value={2}>2 - Bootcamp</MenuItem>
            <MenuItem value={3}>3 - Bachelor's Degree</MenuItem>
            <MenuItem value={4}>4 - Bachelor's Degree (Good University)</MenuItem>
            <MenuItem value={5}>5 - Advanced Degree (Top-tier University)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Education"
          name="education"
          value={editedCandidate.education}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={editedCandidate.phone}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={editedCandidate.email}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="LinkedIn"
          name="linkedin"
          value={editedCandidate.linkedin}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CandidateEditModal;
