import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import { softwareEngineerCandidates as cands, softwareEngineerJobs as jbs } from '../data/Data';

function calcScore(cand, jb){
  let s=0;
  let w=jb.weights;
  if(cand.category===jb.category){
    s+=w.category*5;
  }
  if(cand.companyScore>=jb.companyScoreRange[0] && cand.companyScore<=jb.companyScoreRange[1]){
    s+=w.companyScore*cand.companyScore;
  }else{
    s+=w.companyScore*Math.max(0,cand.companyScore-1);
  }
  if(cand.seniorityLevel>=jb.seniorityLevelRange[0] && cand.seniorityLevel<=jb.seniorityLevelRange[1]){
    s+=w.seniorityLevel*cand.seniorityLevel;
  }else{
    s+=w.seniorityLevel*Math.max(0,cand.seniorityLevel-1);
  }
  if(cand.yearsOfExperience>=jb.yearsOfExperience){
    s+=w.yearsOfExperience*5;
  }else{
    const e=(cand.yearsOfExperience/jb.yearsOfExperience)*5;
    s+=w.yearsOfExperience*e;
  }
  if(cand.educationQuality>=jb.educationQualityRange[0] && cand.educationQuality<=jb.educationQualityRange[1]){
    s+=w.educationQuality*cand.educationQuality;
  }else{
    s+=w.educationQuality*Math.max(0,cand.educationQuality-1);
  }
  return s;
}

export default function CandidateCompatibility(){
  const [cid,setCid]=useState('');
  const [jid,setJid]=useState('');
  const [score,setScore]=useState(null);

  const calcIt=()=>{
    const c=cands.find(x=>x.id===parseInt(cid));
    const j=jbs.find(x=>x.id===parseInt(jid));
    if(c&&j){
      const sc=calcScore(c,j);
      setScore(sc);
    }
  };

  return (
    <div>
      <h2>Compatibility Check</h2>
      <FormControl fullWidth sx={{mb:2}}>
        <InputLabel id="cand">Candidate</InputLabel>
        <Select labelId="cand" value={cid} label="Candidate" onChange={e=>setCid(e.target.value)}>
          {cands.map(c=>(<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{mb:2}}>
        <InputLabel id="job">Job</InputLabel>
        <Select labelId="job" value={jid} label="Job" onChange={e=>setJid(e.target.value)}>
          {jbs.map(j=>(<MenuItem key={j.id} value={j.id}>{j.title}</MenuItem>))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={calcIt}>Calculate</Button>
      {score!==null && (
        <Typography sx={{mt:2}}>Score: {score.toFixed(2)}</Typography>
      )}
    </div>
  );
}
