// src/components/Candidates.js

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { candidates } from '../data/Data';
import { Typography } from '@mui/material';

function Candidates() {
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
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
        />
      </div>
    </div>
  );
}

export default Candidates;
