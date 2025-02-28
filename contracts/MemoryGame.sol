// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MemoryGame {
    uint256 private _count;

    event CounterIncremented(uint256 newCount);

    struct Score {
        string secureId;
        address player;
        uint256 score;
        bool claimed;
    }

    Score[] public highScores;
    mapping(string => Score) public pendingScores; // secureId -> Score
    mapping(address => Score[]) public playerScores;

    event NewPendingScore(string secureId, uint256 score);
    event ScoreClaimed(string secureId, address player, uint256 score);

    constructor() {
        _count = 0;
    }

    function increment() public returns (uint256) {
        _count += 1;
        emit CounterIncremented(_count);
        return _count;
    }

    function getCount() public view returns (uint256) {
        return _count;
    }

    // Submit score with just secureId
    function submitScore(string memory secureId, uint256 score) public {
        require(bytes(secureId).length > 0, "SecureId cannot be empty");

        Score storage existingScore = pendingScores[secureId];
        if (existingScore.score > 0) {
            require(!existingScore.claimed, "Score already claimed");
            existingScore.score = score;
        } else {
            Score memory newScore = Score({
                secureId: secureId,
                player: address(0), // Initially no player address
                score: score,
                claimed: false
            });
            pendingScores[secureId] = newScore;
        }

        emit NewPendingScore(secureId, score);
    }

    // Claim score with address using secureId
    function claimScore(string memory secureId) public {
        require(bytes(secureId).length > 0, "SecureId cannot be empty");
        require(
            pendingScores[secureId].score > 0,
            "No score found for secureId"
        );
        require(!pendingScores[secureId].claimed, "Score already claimed");

        Score storage score = pendingScores[secureId];
        score.player = msg.sender;
        score.claimed = true;

        playerScores[msg.sender].push(score);
        highScores.push(score);

        emit ScoreClaimed(secureId, msg.sender, score.score);
    }

    // Get all scores for a player
    function getPlayerScores(
        address player
    ) public view returns (Score[] memory) {
        return playerScores[player];
    }

    // Get all high scores
    function getHighScores() public view returns (Score[] memory) {
        return highScores;
    }
}
