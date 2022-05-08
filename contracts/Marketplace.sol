//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Prepcoin.sol";

contract Marketplace {
    //State variables
    string public name;
    uint256 public courseCount = 0;
    mapping(uint256 => Course) public courses;
    mapping(address => uint256) public userDownloads;
    mapping(address => Enrolled) enrolledCourses;
    mapping(address => bool) public airdrop;
    PrepCoin prep;
    address tokenOwner;

    // Data structures
    struct Course {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
    }

    struct Enrolled {
        uint256[] courseList;
    }

    event CourseCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner
    );

    event CourseSubscribed(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        uint256[] subscriberList
    );

    event Balance(address payable owner, uint256 balance);

    // constructor which takes token contract address and token contract owner address
    constructor(address _prep, address _tokenOwner) payable {
        name = "UBPrep Marketplace";
        prep = PrepCoin(_prep);
        tokenOwner = _tokenOwner;
    }

    //Modifier to check if user is eligible for rewards
    modifier onlyEligible() {
        require(userDownloads[msg.sender] >= 5);
        _;
    }

    //Modifier to check if the sender is the token owner
    modifier onlyOwner() {
        require(msg.sender == tokenOwner);
        _;
    }

    function createCourse(string memory _name, uint256 _price) public {
        // Require a valid course name
        require(bytes(_name).length > 0);
        // Require a valid course price
        require(_price > 0);

        courseCount++;
        courses[courseCount] = Course({
            id: courseCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender)
        });

        // Triger an event
        emit CourseCreated({
            id: courseCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender)
        });
    }

    function subscribeCourse(uint256 _id) public {
        Course memory _course = courses[_id];
        address payable _creator = _course.owner;

        // Check if the id is valid
        require(_course.id > 0 && _course.id <= courseCount);
        // Require that there are enough PRC with subscribers
        require(prep.balanceOf(msg.sender) >= _course.price);
        // Require that the subscriber is not the creator
        require(_creator != msg.sender);
        //Require allowance to smartcontract
        require(prep.allowance(msg.sender, address(this)) >= _course.price);

        // Pay the owner
        prep.transferFrom(msg.sender, _creator, _course.price);
        //Add course to enrolled courses
        enrolledCourses[msg.sender].courseList.push(_id);
        //Increase download count of owner
        userDownloads[_creator] += 1;

        // Trigger an event
        emit CourseSubscribed({
            id: courseCount,
            name: _course.name,
            price: _course.price,
            owner: payable(msg.sender),
            subscriberList: enrolledCourses[msg.sender].courseList
        });
    }

    function getRewards() public onlyEligible {
        //Reduce the reward threshold by 5
        userDownloads[msg.sender] -= 5;
        //Reward user 50 PRC
        uint256 reward = 50;
        prep.giveRewards(payable(msg.sender), reward);
        emit Balance({
            owner: payable(msg.sender),
            balance: prep.balanceOf(payable(msg.sender))
        });
    }

    //Standard airdrop of 100 PRC once per user address
    function airdropTokens() public {
        require(airdrop[msg.sender] != true);
        prep.airdrop(payable(msg.sender));
        airdrop[msg.sender] = true;
        emit Balance({
            owner: payable(msg.sender),
            balance: prep.balanceOf(payable(msg.sender))
        });
    }

    //Function to airdrop by owner
    function airdropTokenOwner(address _addr, uint256 _amount)
        public
        onlyOwner
    {
        require(prep.allowance(tokenOwner, address(this)) >= _amount);
        prep.transferFrom(tokenOwner, _addr, _amount);
        emit Balance({
            owner: payable(msg.sender),
            balance: prep.balanceOf(payable(msg.sender))
        });
    }

    function getCourseId() public view returns (uint256) {
        return courseCount;
    }

    function getEnrolledCourses() public view returns (uint256[] memory) {
        return enrolledCourses[msg.sender].courseList;
    }

    function viewBalance() public view returns (uint256) {
        return prep.balanceOf(payable(msg.sender));
    }
}
