pragma solidity ^0.5.7;

/// Interfaces.
import "../interfaces/IStatus.sol";

/**
  * @title Status
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the contract that implements the status logic.
  */
contract Status is IStatus {

    Status internal status;

    /// Events.
    event Activated(
        uint256 indexed blockNumber
    );

    event Deactivated(
        uint256 indexed blockNumber
    );

    /// Verifies that contract is active.
    modifier isActivated() {
        require(status == Status.Activated);
        _;
    }

    /**
      * @notice A getter function for contract's status.
      * @return The current status of the contract.
      */
    function getStatus() public view returns(Status) {
        return status;
    }

}