import { useReadContract, useWriteContract, useBlockNumber } from 'wagmi';
import React, { useState, useEffect, } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';

export function IssueList() {
    const queryClient = useQueryClient();


    const [timesCalled, setTimesCalled] = useState(0);
    const [pageIsFocused, setPageIsFocused] = useState(true);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [triggerRead, setTriggerRead] = useState(false);

    const handleTriggerRead = () => {
      setTriggerRead(true);
    };

    const { data: blockNumber } = useBlockNumber({ watch: triggerRead });

    useEffect(() => {
        setTriggerRead(false);
        queryClient.invalidateQueries({ queryKey: issuesQueryKey });
    }, [blockNumber, queryClient]);

    const {
        data: issuesData,
        isError: issuesIsError,
        isPending: issuesIsPending,
        isLoading: issuesIsLoading,
        isFetching: issuesIsFetching,
        queryKey: issuesQueryKey,
      } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'getAllIssues',
      });

    useEffect(() => {
        if (issuesData) {
          const issuesList = issuesData as Issue[];
          console.log('issuesList', issuesList);
          setIssues(issuesList);
        }
      }, [issuesData]);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: issuesQueryKey });
      }, [blockNumber, queryClient, issuesQueryKey]);


    useEffect(() => {
        setTimesCalled((prev) => prev + 1);
        queryClient.invalidateQueries({ queryKey: issuesQueryKey });
      }, [blockNumber, queryClient]);

    const { writeContract: vote, isPending: voteIsPending } = useWriteContract();

    const handleVote = (issueId: number, voteType: number) => {
        vote({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "vote",
            args: [BigInt(issueId), BigInt(voteType)],
        });
    };

    function renderIssues() {

        return issues.map((issue) => (
            <div key={issue.issueDesc}>
                <h3>{issue.issueDesc}</h3>
                <p>{'ID: ' + issue.id.toString()}</p>
                <p>{'Voters: ' + issue.voters.toString()}</p>
                <p>{'Votes For: ' + issue.votesFor.toString()}</p>
                <p>{'Votes Against: ' + issue.votesAgainst.toString()}</p>
                <p>{'Votes Abstain: ' + issue.votesAbstain.toString()}</p>
                <p>{'Quorum: ' + issue.quorum.toString()}</p>
                <p>{'Passed: ' + issue.passed}</p>
                <p>{'Closed: ' + issue.closed}</p>
                <div>
                    <button 
                        onClick={() => handleVote(issue.id, 1)}
                        disabled={issue.closed || voteIsPending}
                    >
                        {voteIsPending ? 'Voting...' : 'Vote For'}
                    </button>
                    <button
                        onClick={() => handleVote(issue.id, 2)} 
                        disabled={issue.closed || voteIsPending}
                    >
                        {voteIsPending ? 'Voting...' : 'Vote Against'}
                    </button>
                    <button
                        onClick={() => handleVote(issue.id, 0)}
                        disabled={issue.closed || voteIsPending}
                    >
                        {voteIsPending ? 'Voting...' : 'Abstain'}
                    </button>
                </div>
            </div>
        ));
    }

    return (
        <div>
          <button disabled={issuesIsLoading} onClick={handleTriggerRead}>
            {issuesIsLoading ? 'Loading' : 'Read Now'}
          </button>
          <h2>Number of times called</h2>
          <p>{timesCalled.toString()}</p>
          <p>{'Has focus: ' + pageIsFocused}</p>
          <h2>All Issues</h2>
          <div>{renderIssues()}</div>
        </div>
      );
}