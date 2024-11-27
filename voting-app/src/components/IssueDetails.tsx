import { Issue } from "../Models/Issue";
import { Paper, Typography, Grid2 } from "@mui/material";

export default function IssueDetails({ issue }: { issue: Issue }) {
    return (
        <Paper elevation={0} sx={{ mb: 3, p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>Issue Details</Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={6}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography>{issue.closed ? 'Closed' : 'Open'}</Typography>
                </Grid2>
                <Grid2 size={6}>
                    <Typography variant="subtitle2">Issue ID</Typography>
                    <Typography>{issue.id.toString()}</Typography>
                </Grid2>
                <Grid2 size={12}>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography>{issue.issueDesc}</Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography variant="subtitle2">For Votes</Typography>
                    <Typography>{issue.votesFor.toString()}</Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography variant="subtitle2">Against Votes</Typography>
                    <Typography>{issue.votesAgainst.toString()}</Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography variant="subtitle2">Abstain Votes</Typography>
                    <Typography>{issue.votesAbstain.toString()}</Typography>
                </Grid2>
            </Grid2>
        </Paper>
    );
}