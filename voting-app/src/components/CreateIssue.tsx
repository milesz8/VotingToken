import { useWriteContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useState } from 'react';

export function CreateIssue() {
    const { writeContract: createIssue, isPending: createIssueIsPending } = useWriteContract();
    const [issueDesc, setIssueDesc] = useState('');
    const [quorum, setQuorum] = useState('');

    const handleCreateIssueClick = () => {
        if (!issueDesc || !quorum) return;
        
        createIssue({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "createIssue",
            args: [issueDesc, BigInt(quorum)],
        });
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Issue Description"
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
            />
            <input
                type="number"
                placeholder="Quorum"
                value={quorum}
                onChange={(e) => setQuorum(e.target.value)}
            />
            <button 
                onClick={handleCreateIssueClick}
                disabled={createIssueIsPending}
            >
                {createIssueIsPending ? 'Creating...' : 'Create Issue'}
            </button>
        </div>
    );
}