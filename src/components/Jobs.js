// src/components/Jobs.js

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { jobs } from '../data/Data';

function Jobs() {
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
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1"><strong>Category:</strong> {job.category}</Typography>
            <Typography variant="subtitle1"><strong>Company Score Range:</strong> {job.companyScoreRange.join(' - ')}</Typography>
            <Typography variant="subtitle1"><strong>Seniority Level Range:</strong> {job.seniorityLevelRange.join(' - ')}</Typography>
            <Typography variant="subtitle1"><strong>Years of Experience:</strong> {job.yearsOfExperience}+</Typography>
            <Typography variant="subtitle1"><strong>Education Quality Range:</strong> {job.educationQualityRange.join(' - ')}</Typography>
            <Typography variant="body1" style={{ marginTop: '15px', whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default Jobs;
