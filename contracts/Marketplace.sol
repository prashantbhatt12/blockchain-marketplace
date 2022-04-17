//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Marketplace {
    //State variables
    string public name;
    uint256 public courseCount = 0;
    mapping(uint256 => Course) public courses;
    mapping(address => uint256) public userDownloads;
    mapping(address => Enrolled) enrolledCourses;

    // Data structures
    struct Course {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        string desc;
    }

    struct Enrolled{
        uint256[] courseList;
    }

    event CourseCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        string desc
    );

    event CourseSubscribed(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        uint256[] subscriberList
    );

    event RewardsBalance(address payable owner, uint256 balance);

    event Received(address, uint256);

    // constructor
    constructor() payable {
        name = "UBPrep Marketplace";
        //To fund the contract for rewards feature 
        payable(this).transfer(msg.value);
    }

    //Modifier to check if user is eligible for rewards
    modifier onlyEligible {
      require(userDownloads[msg.sender] >= 5);
      _;
   }

    function viewBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getCourseId() public view returns (uint256) {
        return courseCount;
    }

    function createCourse(
        string memory _name,
        uint256 _price,
        string memory _desc
    ) public {
        // Require a valid course name
        require(bytes(_name).length > 0);
        // Require a valid course price
        require(_price > 0);

        courseCount++;
        courses[courseCount] = Course({
            id: courseCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender),
            desc: _desc
        });

        // Triger an event
        emit CourseCreated({
            id: courseCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender),
            desc: _desc
        });
    }

    function subscribeCourse(uint256 _id) public payable {
        Course memory _course = courses[_id];
        address payable _creator = _course.owner;

        // Check if the id is valid
        require(_course.id > 0 && _course.id <= courseCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _course.price);
        // Require that the subscriber is not the creator
        require(_creator != msg.sender);

        // Pay the owner
        payable(_creator).transfer(msg.value);
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

    function getEnrolledCourses() public view returns(uint256[] memory){
        return enrolledCourses[msg.sender].courseList;
    }

    function getRewards() public onlyEligible{
        //Reduce the reward threshold by 5
        userDownloads[msg.sender] -= 5;
        //Reward user 5 ether
        uint256 reward = 5 ether;
        payable(msg.sender).transfer(reward);
        emit RewardsBalance({
            owner: payable(msg.sender),
            balance: msg.sender.balance
        });
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}