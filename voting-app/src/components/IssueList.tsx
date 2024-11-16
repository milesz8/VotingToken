import { useReadContract, useBlockNumber } from 'wagmi';
import React, { useState, useEffect, } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import contractData from '../deployments/FEWeightedVoting.json';

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
        address: contractData.address as `0x${string}`,
        abi: contractData.abi,
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

    function renderIssues() {
        return issues.map((issue) => (
            <div key={issue.issueDesc}>
            <h3>{issue.issueDesc}</h3>
            <p>{'Voters: ' + issue.voters.toString()}</p>
            <p>{'Votes For: ' + issue.votesFor.toString()}</p>
            <p>{'Votes Against: ' + issue.votesAgainst.toString()}</p>
            <p>{'Votes Abstain: ' + issue.votesAbstain.toString()}</p>
            <p>{'Quorum: ' + issue.quorum.toString()}</p>
            <p>{'Passed: ' + issue.passed}</p>
            <p>{'Closed: ' + issue.closed}</p>
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