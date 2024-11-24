// index.tsx
import { Typography } from '@mui/material';
import { IssueList } from '../components/IssueList';

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Voting Issues
      </Typography>
      <IssueList />
    </>
  );
}
