// src/components/Jobs.js

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import { softwareEngineerJobs as initialJobs } from '../data/Data';

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Load jobs from localStorage
    const storedJobs = JSON.parse(localStorage.getItem('customJobs')) || [];
    setJobs([...initialJobs, ...storedJobs]);
  }, []);

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      // Remove the job from custom jobs in localStorage
      const storedJobs = JSON.parse(localStorage.getItem('customJobs')) || [];
      const updatedStoredJobs = storedJobs.filter((job) => job.id !== jobId);
      localStorage.setItem('customJobs', JSON.stringify(updatedStoredJobs));

      // Update the jobs list
      const updatedJobs = jobs.filter((job) => job.id !== jobId);
      setJobs(updatedJobs);

      alert('Job deleted successfully.');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Job Descriptions
      </Typography>
      {jobs.map((job) => (
        <Accordion key={job.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${job.id}-content`}
            id={`panel${job.id}-header`}
          >
            <Typography variant="h6">{job.title}</Typography>
            {job.id >= 1000 && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteJob(job.id);
                }}
                aria-label="Delete"
                style={{ marginLeft: 'auto' }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">
              <strong>Category:</strong> {job.category}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Seniority Level Target:</strong> {job.seniorityLevelTarget}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Weights:</strong> Category: {job.weights.category}, Company Score:{' '}
              {job.weights.companyScore}, Seniority Level:{' '}
              {job.weights.seniorityLevel}
            </Typography>
            <Typography
              variant="body1"
              style={{ marginTop: '15px', whiteSpace: 'pre-line' }}
            >
              {job.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default Jobs;
