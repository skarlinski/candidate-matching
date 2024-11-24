// src/components/AddItemModal.js

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
} from '@mui/material';

function AddItemModal({ open, onClose, onAddCandidate, onAddJob }) {
  const [itemType, setItemType] = useState('candidate'); // 'candidate' or 'job'
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [step, setStep] = useState(1);

  const handleAddItem = async () => {
    if (!inputText || !apiKey) {
      alert('Please provide both the required information and API key.');
      return;
    }

    setLoading(true);

    try {
      // Prepare the request to OpenAI API
      const prompt =
        itemType === 'candidate'
          ? `You are an assistant that extracts structured data from candidate profiles for a job matching algorithm.

**Instructions:**

Please parse the following candidate information and provide a JSON object with the following fields:

1. **id**: A unique identifier (use current timestamp or a provided ID).
2. **name**: Candidate's full name.
3. **contactInfo**:
   - **phone**: Contact phone number (if available).
   - **email**: Contact email address (if available).
   - **linkedin**: URL to LinkedIn profile (if available).
4. **category**: Candidate's primary field of expertise. Choose one from:
   - 'Frontend Development'
   - 'Backend Development'
   - 'DevOps'
   - 'Embedded Systems'
   - 'Software Engineering'
   - 'Leadership'
5. **currentPosition**: Current job title.
6. **company**: Current or most recent company.
7. **companyScore**: Rate the company from 1 to 5 based on its reputation and size.
   - **1**: non technological company, or low reputation
   - **2**: Small, unknown tech company, contractors companies, professional services
   - **3**: Small, unproven startups.
   - **4**: promising startups, large startups, well-regarded companies who are not the very best
   - **5**: Leading global tech company (Microsoft, Waze, Google, Elastic)
8. **seniorityLevel**: An integer from 1 to 5 representing the candidate's seniority.
   - **1**: Junior
   - **2**: Mid-level
   - **3**: Senior
   - **4**: Lead
   - **5**: Executive (e.g., CTO)
9. **yearsOfExperience**: Total years of professional experience.
10. **hasManagementExperience**: \`true\` or \`false\` indicating clear management experience.
11. **educationQuality**: An integer from 1 to 5 representing the quality of the education institution.
    - **1**: no education
    - **2**: bootcamp, short course
    - **3-4**: Bachelor's degree from a standard university
    - **5**: Advanced degree from a top-tier university, or bachelor's from a good university with honors
12. **education**: Details about degrees and institutions.

**Important Instructions:**

- Only include the fields specified.
- Ensure all data is accurate based on the provided information.
- The JSON should be properly formatted and valid.

The json structure, do not deviate from it:

{
    id: 9,
    name: 'Tom Lebeodkin',
    category: 'Frontend Development', // Standardized category
    company: 'Pcentra',
    companyScore: 2,
    currentPosition: 'Frontend Developer',
    seniorityLevel: 2,
    yearsOfExperience: 3.5,
    hasManagementExperience: false,
    educationQuality: 1,
    education: 'Web Development Bootcamp (Coding Academy Israel)',
    phone: '+1-555-0108',
    email: 'tom.lebeodkin@example.com',
    linkedin: 'https://www.linkedin.com/in/tomleb/',
},

**Candidate Information:**

${inputText}
`
          : `You are an assistant that helps parse job descriptions into structured data.

**Instructions:**

Please parse the following job description into a JSON object with the following fields:

- **id**: unique identifier (use current timestamp)
- **title**
- **category**: standardized, one of: 'Frontend Development', 'Backend Development', 'DevOps', 'Embedded Systems', 'Software Engineering', 'Leadership'
- **seniorityLevelTarget**: integer from 1 to 5
- **weights**: { category, companyScore, seniorityLevel } (numbers that sum to 10)
- **description**

**Important Instructions**:

- Only output the JSON object.
- Enclose the JSON within a code block like so:
\`\`\`json
{ ... }
\`\`\`
- Do not include any additional text or explanations.

**Job Description:**

${inputText}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantReply = data.choices[0].message.content.trim();

        // Extract JSON from code block if present
        let jsonString = assistantReply;
        const jsonMatch = assistantReply.match(/```json\s*([\s\S]*?)\s*```/);

        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1];
        }

        let parsed;
        try {
          parsed = JSON.parse(jsonString);
        } catch (error) {
          alert("Could not parse the assistant's reply as JSON.");
          console.error('Error parsing JSON:', error);
          setLoading(false);
          return;
        }

        // Assign a new unique ID if not provided
        parsed.id = Date.now();

        setParsedData(parsed);
        setStep(2); // Move to the preview step
      } else {
        alert(`Error: ${data.error.message}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('An error occurred while adding the item.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (itemType === 'candidate') {
      onAddCandidate(parsedData);
    } else {
      onAddJob(parsedData);
    }

    // Reset form and close modal
    setInputText('');
    setApiKey('');
    setItemType('candidate');
    setParsedData(null);
    setStep(1);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setStep(1);
        setParsedData(null);
        onClose();
      }}
      aria-labelledby="add-item-modal-title"
      aria-describedby="add-item-modal-description"
    >
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
        {step === 1 && (
          <>
            <Typography id="add-item-modal-title" variant="h5" component="h2">
              Add {itemType === 'candidate' ? 'Candidate' : 'Job'}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="item-type-label">Item Type</InputLabel>
              <Select
                labelId="item-type-label"
                value={itemType}
                label="Item Type"
                onChange={(e) => setItemType(e.target.value)}
              >
                <MenuItem value="candidate">Candidate</MenuItem>
                <MenuItem value="job">Job</MenuItem>
              </Select>
            </FormControl>
            <Typography
              id="add-item-modal-description"
              sx={{ mt: 2, fontSize: '16px' }}
            >
              Please enter the {itemType} information and your OpenAI API key.
            </Typography>
            <TextField
              label={itemType === 'candidate' ? 'Candidate Information' : 'Job Description'}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="OpenAI API Key"
              type="password"
              fullWidth
              variant="outlined"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              You can get your API key from{' '}
              <Link
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener"
              >
                OpenAI API Keys
              </Link>
              .
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </>
        )}
        {step === 2 && parsedData && (
          <>
            <Typography id="preview-modal-title" variant="h5" component="h2">
              Preview {itemType === 'candidate' ? 'Candidate' : 'Job'} Information
            </Typography>
            <Typography
              id="preview-modal-description"
              sx={{ mt: 2, fontSize: '16px' }}
            >
              Please review the {itemType} information below before adding.
            </Typography>
            {itemType === 'candidate' ? (
              <Box sx={{ mt: 2 }}>
                <strong>Name:</strong> {parsedData.name}
                <br />
                <strong>Category:</strong> {parsedData.category}
                <br />
                <strong>Current Position:</strong> {parsedData.currentPosition}
                <br />
                <strong>Company:</strong> {parsedData.company}
                <br />
                <strong>Company Score:</strong> {parsedData.companyScore}{' '}
                {getCompanyScoreExplanation(parsedData.companyScore)}
                <br />
                <strong>Seniority Level:</strong> {parsedData.seniorityLevel}{' '}
                {getSeniorityLevelExplanation(parsedData.seniorityLevel)}
                <br />
                <strong>Years of Experience:</strong> {parsedData.yearsOfExperience}
                <br />
                <strong>Has Management Experience:</strong>{' '}
                {parsedData.hasManagementExperience ? 'Yes' : 'No'}
                <br />
                <strong>Education Quality:</strong> {parsedData.educationQuality}{' '}
                {getEducationQualityExplanation(parsedData.educationQuality)}
                <br />
                <strong>Education:</strong> {parsedData.education}
                <br />
                <strong>Phone:</strong> {parsedData.phone}
                <br />
                <strong>Email:</strong> {parsedData.email}
                <br />
                <strong>LinkedIn:</strong>{' '}
                <Link href={parsedData.linkedin} target="_blank" rel="noopener">
                  {parsedData.linkedin}
                </Link>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <strong>Title:</strong> {parsedData.title}
                <br />
                <strong>Category:</strong> {parsedData.category}
                <br />
                <strong>Seniority Level Target:</strong> {parsedData.seniorityLevelTarget}
                <br />
                <strong>Weights:</strong>{' '}
                {`Category: ${parsedData.weights.category}, Company Score: ${parsedData.weights.companyScore}, Seniority Level: ${parsedData.weights.seniorityLevel}`}
                <br />
                <strong>Description:</strong> {parsedData.description}
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                onClick={() => {
                  setStep(1);
                  setParsedData(null);
                }}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleConfirmAdd}>
                Confirm and Add
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

// Helper functions to get explanations
function getCompanyScoreExplanation(score) {
  const explanations = {
    1: '(Non-technological company, or low reputation)',
    2: '(Small, unknown tech company, contractors companies, professional services)',
    3: '(Small, unproven startups)',
    4: '(Promising startups, large startups, well-regarded companies)',
    5: '(Leading global tech company like Microsoft, Waze, Google, Elastic)',
  };
  return explanations[score] || '';
}

function getSeniorityLevelExplanation(level) {
  const explanations = {
    1: '- Junior',
    2: '- Mid-level',
    3: '- Senior',
    4: '- Lead',
    5: '- Executive (e.g., CTO)',
  };
  return explanations[level] || '';
}

function getEducationQualityExplanation(quality) {
  const explanations = {
    1: '(No education)',
    2: '(Bootcamp, short course)',
    3: "(Bachelor's degree from a standard university)",
    4: "(Bachelor's degree from a good university)",
    5: '(Advanced degree from a top-tier university, or bachelor\'s with honors)',
  };
  return explanations[quality] || '';
}

export default AddItemModal;
