// index.tsx
import { Typography, Paper, Grid } from '@mui/material';
import { CreateIssue } from '../components/CreateIssue';
import { IssueList } from '../components/IssueList';

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Voting Issues
      </Typography>
      <CreateIssue />
      <IssueList />
    </>
  );
}
