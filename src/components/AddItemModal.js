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
  const [newItemPreview, setNewItemPreview] = useState(null); // State to hold the new item preview
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddItem = async () => {
    if (!inputText || !apiKey) {
      alert('Please provide both the required information and API key.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

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

        let newItem;
        try {
          newItem = JSON.parse(jsonString);
        } catch (error) {
          alert("Could not parse the assistant's reply as JSON.");
          console.error('Error parsing JSON:', error);
          setLoading(false);
          return;
        }

        // Assign a new unique ID if not provided
        newItem.id = Date.now();

        // If itemType is candidate, show preview before adding
        if (itemType === 'candidate') {
          setNewItemPreview(newItem);
        } else {
          // For jobs, add directly
          onAddJob(newItem);

          // Reset form and close modal
          setInputText('');
          setApiKey('');
          setItemType('candidate');
          onClose();
        }
      } else {
        setErrorMessage(`Error: ${data.error.message}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setErrorMessage('An error occurred while adding the item.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAddCandidate = () => {
    onAddCandidate(newItemPreview);

    // Reset form and close modal
    setInputText('');
    setApiKey('');
    setItemType('candidate');
    setNewItemPreview(null);
    onClose();
  };

  const handleCancelAddCandidate = () => {
    // Reset the preview and go back to input step
    setNewItemPreview(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setNewItemPreview(null);
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
        {!newItemPreview ? (
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
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
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
        ) : (
          // Show preview of the candidate
          <>
            <Typography id="preview-modal-title" variant="h5" component="h2">
              Preview Candidate Information
            </Typography>
            <Typography
              id="preview-modal-description"
              sx={{ mt: 2, fontSize: '16px' }}
            >
              Please review the candidate information below before adding.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {newItemPreview.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Category:</strong> {newItemPreview.category}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Current Position:</strong> {newItemPreview.currentPosition}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Company:</strong> {newItemPreview.company}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Company Score:</strong> {newItemPreview.companyScore}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Seniority Level:</strong> {newItemPreview.seniorityLevel}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Years of Experience:</strong> {newItemPreview.yearsOfExperience}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Has Management Experience:</strong>{' '}
                {newItemPreview.hasManagementExperience ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Education Quality:</strong> {newItemPreview.educationQuality}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Education:</strong> {newItemPreview.education}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Phone:</strong> {newItemPreview.phone}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Email:</strong> {newItemPreview.email}
              </Typography>
              <Typography variant="subtitle1">
                <strong>LinkedIn:</strong>{' '}
                <Link href={newItemPreview.linkedin} target="_blank" rel="noopener">
                  {newItemPreview.linkedin}
                </Link>
              </Typography>
            </Box>
            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="outlined"
                onClick={handleCancelAddCandidate}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmAddCandidate}
              >
                Add Candidate
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default AddItemModal;
