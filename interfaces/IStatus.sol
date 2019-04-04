pragma solidity ^0.5.7;

/**
  * @title IStatus interface
  * @notice Provides the basic activate/deactivate functions
  * and the Status enumeration.
  */
interface IStatus {
    enum Status {
        Activated,
        Deactivated
    }
    function getStatus() external view returns(Status);
    function activate() external returns(bool);
    function deactivate() external returns(bool);
}