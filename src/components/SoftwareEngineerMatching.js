// src/components/SoftwareEngineerMatching.js

import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ForwardIcon from '@mui/icons-material/Forward'; // Icon for Next Steps
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import {
  softwareEngineerCandidates,
  softwareEngineerJobs,
  softwareCategoryMatrix,
} from '../data/Data';

function SoftwareEngineerMatching() {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortedCandidates, setSortedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openExplanationModal, setOpenExplanationModal] = useState(false);
  const [openNextStepsModal, setOpenNextStepsModal] = useState(false); // State for Next Steps modal

  const handleJobChange = (event) => {
    const jobId = event.target.value;
    setSelectedJobId(jobId);

    const job = softwareEngineerJobs.find((job) => job.id === jobId);
    setSelectedJob(job);

    // Calculate match scores
    const candidatesWithScores = softwareEngineerCandidates.map((candidate) => {
      const { matchScore, matchDetails } = calculateMatchScore(candidate, job);
      return { ...candidate, matchScore, matchDetails };
    });

    // Sort candidates by match score (highest to lowest)
    candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    setSortedCandidates(candidatesWithScores);
  };

  // Normalize company score (higher is better)
  function normalizeCompanyScore(candidateCompanyScore) {
    const minCompanyScore = 1; // Minimum possible company score
    const maxCompanyScore = 5; // Maximum possible company score
    const normalized =
      (candidateCompanyScore - minCompanyScore) / (maxCompanyScore - minCompanyScore);
    return Math.max(0, Math.min(normalized, 1)); // Ensure the value is between 0 and 1
  }

  // Calculate seniority score based on distance from target seniority
  function calculateSeniorityScore(candidateSeniority, targetSeniority) {
    const difference = Math.abs(candidateSeniority - targetSeniority);

    let seniorityScore;
    if (difference === 0) {
      seniorityScore = 1.0; // Perfect match
    } else if (difference === 1) {
      seniorityScore = 0.7; // Acceptable
    } else {
      seniorityScore = 0.0; // Penalize
    }

    return seniorityScore;
  }

  // Calculate the match score and provide match details
  function calculateMatchScore(candidate, job) {
    // Get the candidate's category scores
    const candidateCategories = softwareCategoryMatrix[candidate.category];
    if (!candidateCategories) {
      console.error(
        `Candidate category '${candidate.category}' not found in category matrix.`
      );
      return { matchScore: 0, matchDetails: {} };
    }

    // Get the category score between the candidate and the job
    const categoryScore = candidateCategories[job.category] || 0;

    // Normalize the company score
    const companyScoreNormalized = normalizeCompanyScore(candidate.companyScore);

    // Calculate seniority score based on distance
    const seniorityScore = calculateSeniorityScore(
      candidate.seniorityLevel,
      job.seniorityLevelTarget
    );

    // Weights
    const weights = job.weights;

    // Compute the weighted sum
    const matchScore =
      (categoryScore * weights.category +
        companyScoreNormalized * weights.companyScore +
        seniorityScore * weights.seniorityLevel) /
      (weights.category + weights.companyScore + weights.seniorityLevel);

    // Prepare match details for breakdown
    const matchDetails = {
      categoryScore: categoryScore.toFixed(2),
      companyScoreNormalized: companyScoreNormalized.toFixed(2),
      seniorityScore: seniorityScore.toFixed(2),
      weightedCategoryScore: (categoryScore * weights.category).toFixed(2),
      weightedCompanyScore: (companyScoreNormalized * weights.companyScore).toFixed(2),
      weightedSeniorityScore: (seniorityScore * weights.seniorityLevel).toFixed(2),
      totalWeight: weights.category + weights.companyScore + weights.seniorityLevel,
    };

    return { matchScore: matchScore * 100, matchDetails };
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Software Engineer Matching
      </Typography>

      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="job-select-label">Select Job</InputLabel>
            <Select
              labelId="job-select-label"
              value={selectedJobId}
              onChange={handleJobChange}
              label="Select Job"
            >
              {softwareEngineerJobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<HelpOutlineIcon />}
            onClick={() => setOpenExplanationModal(true)}
            style={{ marginRight: '10px' }}
          >
            Explanation
          </Button>
          <Button
            variant="outlined"
            startIcon={<ForwardIcon />}
            onClick={() => setOpenNextStepsModal(true)}
          >
            Next Steps
          </Button>
        </Grid>
      </Grid>

      {selectedJob && (
        <Card variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {selectedJob.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Category: {selectedJob.category}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              {selectedJob.description}
            </Typography>
          </CardContent>
        </Card>
      )}

      {sortedCandidates.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="matching table">
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Match Score (%)</TableCell>
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
                    <IconButton
                      onClick={() => setSelectedCandidate(candidate)}
                      aria-label="Details"
                    >
                      <InfoIcon color="primary" />
                    </IconButton>
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
      )}

      {/* Candidate Details Modal */}
      <Modal
        open={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        aria-labelledby="candidate-modal-title"
        aria-describedby="candidate-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedCandidate && selectedJob && (
            <>
              <Typography id="candidate-modal-title" variant="h5" component="h2">
                Candidate Details: {selectedCandidate.name}
              </Typography>
              <Typography
                id="candidate-modal-description"
                sx={{ mt: 2, fontSize: '16px' }}
              >
                <strong>Category:</strong> {selectedCandidate.category}
                <br />
                <strong>Company:</strong> {selectedCandidate.company}
                <br />
                <strong>Current Position:</strong> {selectedCandidate.currentPosition}
                <br />
                <strong>Seniority Level:</strong> {selectedCandidate.seniorityLevel}
                <br />
                <strong>Years of Experience:</strong>{' '}
                {selectedCandidate.yearsOfExperience}
                <br />
                <strong>Education:</strong> {selectedCandidate.education}
                <br />
                <strong>Phone:</strong> {selectedCandidate.phone}
                <br />
                <strong>Email:</strong> {selectedCandidate.email}
                <br />
                <br />
                <Typography variant="h6">Job Details: {selectedJob.title}</Typography>
                <strong>Category:</strong> {selectedJob.category}
                <br />
                <strong>Target Seniority Level:</strong>{' '}
                {selectedJob.seniorityLevelTarget}
                <br />
                <strong>Description:</strong> {selectedJob.description}
                <br />
                <br />
                <Typography variant="h6">Match Score Breakdown</Typography>
                <strong>Total Match Score:</strong>{' '}
                {selectedCandidate.matchScore.toFixed(2)}%
                <br />
                <strong>Category Score:</strong>{' '}
                {selectedCandidate.matchDetails.categoryScore} (Weighted:{' '}
                {selectedCandidate.matchDetails.weightedCategoryScore})
                <br />
                <strong>Company Score:</strong>{' '}
                {selectedCandidate.matchDetails.companyScoreNormalized} (Weighted:{' '}
                {selectedCandidate.matchDetails.weightedCompanyScore})
                <br />
                <strong>Seniority Score:</strong>{' '}
                {selectedCandidate.matchDetails.seniorityScore} (Weighted:{' '}
                {selectedCandidate.matchDetails.weightedSeniorityScore})
                <br />
                <strong>Total Weight:</strong>{' '}
                {selectedCandidate.matchDetails.totalWeight}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Explanation Modal */}
      <Modal
        open={openExplanationModal}
        onClose={() => setOpenExplanationModal(false)}
        aria-labelledby="explanation-modal-title"
        aria-describedby="explanation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="explanation-modal-title" variant="h5" component="h2">
            Score Calculation Explanation
          </Typography>
          <Typography
            id="explanation-modal-description"
            sx={{ mt: 2, fontSize: '16px' }}
          >
            The system calculates a total match score for each candidate by combining
            three criteria, weighted according to the job's specifications.
            <br />
            <br />
            <strong>Category Score:</strong>
            <br />
            Determined from the category similarity matrix. If a candidate's category
            perfectly matches the job's category, they receive the highest score. Related
            fields receive partial scores, and unrelated fields score lower.
            <br />
            <br />
            <strong>Company Score Normalization:</strong>
            <br />
            The candidate's company score is normalized on a scale from 0 to 1. Higher
            company scores contribute more positively to the overall match score.
            <br />
            <br />
            <strong>Seniority Score:</strong>
            <br />
            Calculated based on the absolute difference between the candidate's
            seniority level and the job's target seniority level.
            <ul>
              <li>
                A difference of <strong>0</strong>: Perfect match (score of 1.0).
              </li>
              <li>
                A difference of <strong>1</strong>: Acceptable match (score of 0.7).
              </li>
              <li>
                A difference of <strong>2 or more</strong>: Less suitable (score of
                0.0).
              </li>
            </ul>
            <strong>Applying Weights:</strong>
            <br />
            Each criterion is multiplied by its assigned weight. Weights reflect the
            importance of each criterion for the specific job. For example, a job might
            assign more weight to category match if expertise is crucial.
            <br />
            <br />
            <strong>Total Match Score:</strong>
            <br />
            The weighted scores are summed and divided by the total weight. The result
            is a percentage representing the candidate's overall suitability.
          </Typography>
        </Box>
      </Modal>

      {/* Next Steps Modal */}
      <Modal
        open={openNextStepsModal}
        onClose={() => setOpenNextStepsModal(false)}
        aria-labelledby="next-steps-modal-title"
        aria-describedby="next-steps-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="next-steps-modal-title" variant="h5" component="h2">
            Next Steps
          </Typography>
          <Typography
            id="next-steps-modal-description"
            sx={{ mt: 2, fontSize: '16px' }}
          >
            <ul>
              <li>
                <strong>Adding education to the computation:</strong> Incorporate the
                match between a candidate's education and the job category into the
                scoring algorithm.
              </li>
              <li>
                <strong>Very granular categories:</strong> Utilize more specific
                categories to fully leverage the category matrix for precise matching.
              </li>
              <li>
                <strong>Integration with Salesforce:</strong> Connect the matching system
                with Salesforce for seamless data management and workflow integration.
              </li>
            </ul>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default SoftwareEngineerMatching;
