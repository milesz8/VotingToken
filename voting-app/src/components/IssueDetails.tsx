import { Issue } from "../Models/Issue";
import { Paper, Typography, Grid2 } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function IssueDetails({ issue }: { issue: Issue }) {
    const totalVotes = BigInt(issue.votesFor) + BigInt(issue.votesAgainst) + BigInt(issue.votesAbstain);
    const votesNeeded = Math.max(0, Number(BigInt(issue.quorum) - totalVotes));
    
    const voteData = [
        {
            name: 'Votes',
            For: Number(issue.votesFor),
            Against: Number(issue.votesAgainst),
            Abstain: Number(issue.votesAbstain),
            "Votes To Close": votesNeeded
        }
    ];
    const COLORS = ['#4caf50', '#f44336', '#2196f3', '#9e9e9e'];

    return (
        <Paper elevation={0} sx={{ 
            mb: 3, 
            p: 3, 
            width: '100%',
            minHeight: '180px'
        }}>
            <Typography 
                variant="h6" 
                gutterBottom 
                sx={{
                    wordWrap: 'break-word', 
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                }}
            >
                {issue.issueDesc}
            </Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={12} sx={{ minHeight: '100px' }}>
                    <ResponsiveContainer width="100%" height={100}>
                        <BarChart 
                            data={voteData}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, Number(issue.quorum)]} />
                            <YAxis dataKey="name" type="category" />
                            <Legend />
                            <Bar dataKey="For" stackId="a" fill={COLORS[0]} />
                            <Bar dataKey="Against" stackId="a" fill={COLORS[1]} />
                            <Bar dataKey="Abstain" stackId="a" fill={COLORS[2]} />
                            <Bar dataKey="Votes To Close" stackId="a" fill={COLORS[3]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid2>
            </Grid2>
        </Paper>
    );
}