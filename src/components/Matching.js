// src/components/Matching.js

import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { ButtonGroup, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { candidates, jobs } from '../data/Data';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


function calculateMatchScore(candidate, job) {
  let score = 0;
  const weights = job.weights;

  // Category match
  if (candidate.category === job.category) {
    score += weights.category * 5;
  }

  // Company score
  if (
    candidate.companyScore >= job.companyScoreRange[0] &&
    candidate.companyScore <= job.companyScoreRange[1]
  ) {
    score += weights.companyScore * candidate.companyScore;
  } else {
    // Penalize if company score is lower
    score += weights.companyScore * Math.max(0, candidate.companyScore - 1);
  }

  // Seniority level
  if (
    candidate.seniorityLevel >= job.seniorityLevelRange[0] &&
    candidate.seniorityLevel <= job.seniorityLevelRange[1]
  ) {
    score += weights.seniorityLevel * candidate.seniorityLevel;
  } else {
    // Penalize if seniority does not match
    score += weights.seniorityLevel * Math.max(0, candidate.seniorityLevel - 1);
  }

  // Years of experience
  if (candidate.yearsOfExperience >= job.yearsOfExperience) {
    score += weights.yearsOfExperience * 5;
  } else {
    // Scale score based on proximity
    const experienceScore =
      (candidate.yearsOfExperience / job.yearsOfExperience) * 5;
    score += weights.yearsOfExperience * experienceScore;
  }

  // Education quality
  if (
    candidate.educationQuality >= job.educationQualityRange[0] &&
    candidate.educationQuality <= job.educationQualityRange[1]
  ) {
    score += weights.educationQuality * candidate.educationQuality;
  } else {
    score += weights.educationQuality * Math.max(0, candidate.educationQuality - 1);
  }

  return score;
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
  }, [selectedJobId]);

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
        <strong>Years of Experience:</strong> {candidate.yearsOfExperience}{'\n'}
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