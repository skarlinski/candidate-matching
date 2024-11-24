// src/components/Candidates.js

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { softwareEngineerCandidates as initialCandidates } from '../data/Data';
import { Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CandidateEditModal from './CandidateEditModal'; // We'll create this component

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    // Load candidates from localStorage
    const storedCandidates = JSON.parse(localStorage.getItem('customCandidates')) || [];
    setCandidates([...initialCandidates, ...storedCandidates]);
  }, []);

  const handleDeleteCandidate = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      // Remove the candidate from custom candidates in localStorage
      const storedCandidates = JSON.parse(localStorage.getItem('customCandidates')) || [];
      const updatedStoredCandidates = storedCandidates.filter((candidate) => candidate.id !== id);
      localStorage.setItem('customCandidates', JSON.stringify(updatedStoredCandidates));

      // Update the candidates list
      const updatedCandidates = candidates.filter((candidate) => candidate.id !== id);
      setCandidates(updatedCandidates);

      alert('Candidate deleted successfully.');
    }
  };

  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenEditModal(true);
  };

  const handleUpdateCandidate = (updatedCandidate) => {
    // Update candidate in customCandidates in localStorage
    const storedCandidates = JSON.parse(localStorage.getItem('customCandidates')) || [];
    const candidateIndex = storedCandidates.findIndex((c) => c.id === updatedCandidate.id);
    if (candidateIndex !== -1) {
      storedCandidates[candidateIndex] = updatedCandidate;
      localStorage.setItem('customCandidates', JSON.stringify(storedCandidates));
    }

    // Update the candidates list
    const candidateIndexInState = candidates.findIndex((c) => c.id === updatedCandidate.id);
    if (candidateIndexInState !== -1) {
      const updatedCandidates = [...candidates];
      updatedCandidates[candidateIndexInState] = updatedCandidate;
      setCandidates(updatedCandidates);
    }

    setOpenEditModal(false);
    alert('Candidate updated successfully.');
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const candidate = params.row;
        const isCustomCandidate = candidate.id >= 1000; // Custom candidates have id >= 1000

        return isCustomCandidate ? (
          <>
            <IconButton
              onClick={() => handleEditCandidate(candidate)}
              aria-label="Edit"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteCandidate(candidate.id)}
              aria-label="Delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : null;
      },
    },
    { field: 'category', headerName: 'Category', width: 200 },

    { field: 'company', headerName: 'Company', width: 200 },
    { field: 'currentPosition', headerName: 'Current Position', width: 200 },
    { field: 'seniorityLevel', headerName: 'Seniority Level', width: 150 },
    { field: 'yearsOfExperience', headerName: 'Years of Experience', width: 180 },
    { field: 'educationQuality', headerName: 'Education Quality', width: 180 },
    { field: 'education', headerName: 'Education', width: 300 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Candidates
      </Typography>
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={candidates}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.id}
        />
      </div>

      {selectedCandidate && (
        <CandidateEditModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          candidate={selectedCandidate}
          onSave={handleUpdateCandidate}
        />
      )}
    </div>
  );
}

export default Candidates;
