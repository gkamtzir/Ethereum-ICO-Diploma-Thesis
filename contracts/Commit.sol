pragma solidity ^0.5.7;

/// Interfaces.
import "../interfaces/ICommit.sol";

/**
  * @title Commit
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the contract that implements the basic commit utilities.
  */
contract Commit is ICommit {
    /// Structs.
    struct CommitStatus {
        uint256 fromBalance;
        uint256 fromRented;
    }

    mapping(address => CommitStatus) internal commited;

    /// Events.
    event CommitedFromBalance(
        address indexed from,
        uint256 numberOfTokens
    );

    event CommitedToBalance(
        address indexed from,
        uint256 numberOfTokens
    );

    event CommitedFromRented(
        address indexed from,
        uint256 numberOfTokens
    );

    event CommitedToRented(
        address indexed from,
        uint256 numberOfTokens
    );

    /**
      * @notice A getter function for the commited tokens of the
      * sender that come from the balance.
      * @return The number of commited tokens of the sender that
      * come from the balance.
      */
    function getCommitedFromBalance() public view returns(uint256) {
        return commited[msg.sender].fromBalance;
    }

    /**
      * @notice A getter function for the commited tokens of the
      * sender that come from the rented tokens.
      * @return The number of commited tokens of the sender that
      * come from the rented tokens.
      */
    function getCommitedFromRented() public view returns(uint256) {
        return commited[msg.sender].fromRented;
    }

}