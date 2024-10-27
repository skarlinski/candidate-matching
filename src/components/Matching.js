// src/components/Matching.js

import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { ButtonGroup } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { candidates, jobs } from '../data/Data';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// src/components/Matching.js

import { categoryMatrix } from '../data/Data';

function calculateMatchScore(candidate, job) {
  // Category score from the category matrix
  const categoryScore = categoryMatrix[candidate.category][job.category];

  // Company score
  const companyScoreNormalized =
    (Math.min(candidate.companyScore, job.companyScoreRange[1]) -
      job.companyScoreRange[0]) /
    (job.companyScoreRange[1] - job.companyScoreRange[0]);

  // Seniority level score
  const seniorityLevelNormalized =
    (Math.min(candidate.seniorityLevel, job.seniorityLevelRange[1]) -
      job.seniorityLevelRange[0]) /
    (job.seniorityLevelRange[1] - job.seniorityLevelRange[0]);

  // Weights
  const weights = job.weights;

  // Compute the weighted sum
  const matchScore =
    categoryScore * weights.category +
    companyScoreNormalized * weights.companyScore +
    seniorityLevelNormalized * weights.seniorityLevel;

  // Normalize the match score
  const maxPossibleScore =
    weights.category + weights.companyScore + weights.seniorityLevel;

  return (matchScore / maxPossibleScore) * 100; // Return as a percentage
}

function Matching() {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [sortedCandidates, setSortedCandidates] = useState([]);
  const selectedJob = jobs.find((job) => job.id === parseInt(selectedJobId));

  useEffect(() => {
    const candidateScores = candidates.map((candidate) => {
      const score = calculateMatchScore(candidate, selectedJob);
      return { ...candidate, matchScore: score };
    });

    const sorted = candidateScores.sort((a, b) => b.matchScore - a.matchScore);
    setSortedCandidates(sorted);
  }, [selectedJob, selectedJobId]);

 return (
    <div>
      <h2>Candidate Matching</h2>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="job-select-label">Select Job</InputLabel>
        <Select
          labelId="job-select-label"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          label="Select Job"
        >
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table aria-label="matching table">
          <TableHead>
            <TableRow>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Match Score</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.matchScore.toFixed(2)}</TableCell>
                  
<TableCell>
  <Tooltip
    title={
      <div style={{ whiteSpace: 'pre-line' }}>
        <strong>Name:</strong> {candidate.name}{'\n'}
        <strong>Category:</strong> {candidate.category}{'\n'}
        <strong>Company:</strong> {candidate.company}{'\n'}
        <strong>Position:</strong> {candidate.currentPosition}{'\n'}
        <strong>Seniority Level:</strong> {candidate.seniorityLevel}{'\n'}
        <strong>Education Quality:</strong> {candidate.educationQuality}{'\n'}
        <strong>Education:</strong> {candidate.education}{'\n'}
        <strong>Phone:</strong> {candidate.phone}{'\n'}
        <strong>Email:</strong> {candidate.email}
      </div>
    }
    arrow
    placement="right"
  >
    <IconButton>
      <InfoIcon color="primary" />
    </IconButton>
  </Tooltip>
</TableCell>
                <TableCell>
                  <ButtonGroup variant="text" size="small">
                    <IconButton
                      component="a"
                      href={`tel:${candidate.phone}`}
                      aria-label="Call"
                    >
                      <PhoneIcon color="primary" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={`mailto:${candidate.email}`}
                      aria-label="Email"
                    >
                      <EmailIcon color="primary" />


                    </IconButton>
                    <IconButton
      component="a"
      href={candidate.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn Profile"
    >
      <LinkedInIcon color="primary" />
    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Matching;