// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";


contract WeightedVoting is ERC20 {
    using EnumerableSet for EnumerableSet.AddressSet;

    Issue[] private issues;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        issues.push();
    }

    uint public maxSupply = 1000000;
    uint public totalClaimed;

    error TokensClaimed();
    error AllTokensClaimed();
    error NoTokensHeld();
    error QuorumTooHigh();
    error AlreadyVoted();
    error VotingClosed();
    error InvalidVote();
    struct Issue {
        uint256 id;
        EnumerableSet.AddressSet voters;
        string issueDesc;
        uint256 quorum;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        uint256 totalVotes;
        bool passed;
        bool closed;
    }

    struct ReturnIssue {
        uint256 id;
        address[] voters;
        string issueDesc;
        uint256 quorum;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        uint256 totalVotes;
        bool passed;
        bool closed;
    }

    enum Vote {
        FOR,
        AGAINST,
        ABSTAIN
    }

    function claim() external {
        if (totalSupply() >= maxSupply) {
            revert AllTokensClaimed();
        }
        if (_claimed[msg.sender]) {
            revert TokensClaimed();
        }
        ERC20._mint(msg.sender, 100);
        totalClaimed += 100;
        _claimed[msg.sender] = true;
    }

    mapping(address => bool) public _claimed;

    function hasClaimed(address user) public view returns (bool) {
        return _claimed[user];
    }

    function createIssue(string memory issueDesc, uint256 quorum) external returns (uint) {
        if (balanceOf(msg.sender) == 0) {
            revert NoTokensHeld();
        }

        if (quorum > totalSupply()) {
            revert QuorumTooHigh();
        }

        Issue storage newIssue = issues.push();
        newIssue.issueDesc = issueDesc;
        newIssue.quorum = quorum;
        newIssue.id = issues.length - 1;
        return newIssue.id;
    }

    function getIssue(uint256 index) public view returns (ReturnIssue memory) {
        Issue storage issue = issues[index];
        return ReturnIssue({
            id: issue.id,
            voters: issue.voters.values(),
            issueDesc: issue.issueDesc,
            quorum: issue.quorum,
            votesFor: issue.votesFor,
            votesAgainst: issue.votesAgainst,
            votesAbstain: issue.votesAbstain,
            totalVotes: issue.totalVotes,
            passed: issue.passed,
            closed: issue.closed
        });
    }

    function vote(uint256 issueId, Vote _vote) external {
        Issue storage issue = issues[issueId];
        if (issue.closed) {
            revert VotingClosed();
        }

        if (issue.voters.contains(msg.sender)) {
            revert AlreadyVoted();
        }

        issue.voters.add(msg.sender);
        issue.totalVotes += balanceOf(msg.sender);

        if (_vote == Vote.FOR) {
            issue.votesFor += balanceOf(msg.sender);
        } else if (_vote == Vote.AGAINST) {
            issue.votesAgainst += balanceOf(msg.sender);
        } else if (_vote == Vote.ABSTAIN) {
            issue.votesAbstain += balanceOf(msg.sender);
        } else {
            revert InvalidVote();
        }

        if (issue.votesFor >= issue.quorum) {
            if (issue.votesAgainst < issue.votesFor) {
                issue.passed = true;
            }
            issue.closed = true;
        }
    }

    function numberOfIssues() external view returns (uint) {
        return issues.length;
    }

    function getAllIssues() external view returns (ReturnIssue[] memory) {
        ReturnIssue[] memory allIssues = new ReturnIssue[](issues.length - 1);
        for (uint i = 1; i < issues.length; i++) {
            allIssues[i - 1] = getIssue(i);
        }
        return allIssues;
    }
}
