// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudAudit {
    struct FraudRecord {
        string transactionId;
        string verdict;
        uint8 riskScore;
        uint256 timestamp;
        address reportedBy;
    }

    FraudRecord[] public records;

    event FraudLogged(
        string transactionId,
        string verdict,
        uint8 riskScore,
        uint256 timestamp,
        address reportedBy
    );

    function logFraud(
        string memory transactionId,
        string memory verdict,
        uint8 riskScore
    ) public {
        FraudRecord memory record = FraudRecord({
            transactionId: transactionId,
            verdict: verdict,
            riskScore: riskScore,
            timestamp: block.timestamp,
            reportedBy: msg.sender
        });

        records.push(record);

        emit FraudLogged(
            transactionId,
            verdict,
            riskScore,
            block.timestamp,
            msg.sender
        );
    }

    function getRecord(uint256 index) public view returns (
        string memory,
        string memory,
        uint8,
        uint256,
        address
    ) {
        FraudRecord memory r = records[index];
        return (r.transactionId, r.verdict, r.riskScore, r.timestamp, r.reportedBy);
    }

    function getTotalRecords() public view returns (uint256) {
        return records.length;
    }
}