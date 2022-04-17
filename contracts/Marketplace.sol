//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Marketplace {
    // State var
    string public name;
    uint256 public productCount = 0;
    // key: id, value: Product
    mapping(uint256 => Product) public products;
    mapping(address => uint256) public userDownloads;
    mapping(address => uint256) public totalDownloads;
    mapping(address => Enrolled) enrolledCourse;
    // Data structure
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
        string desc;
    }

    struct Enrolled{
        uint256[] courseList;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased,
        string desc
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased,
        uint256[] subscriberList
    );

    event RewardsBalance(address payable owner, uint256 balance);

    event Received(address, uint256);

    // constructor: function run only one times when deploy
    constructor() payable {
        name = "UBPrep Marketplace";
        payable(this).transfer(msg.value);
    }

    function viewBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // `_`: convention to mention local ver, not state var
    // `memory`: local var, not in blockchain
    function createProduct(
        string memory _name,
        uint256 _price,
        string memory _desc
    ) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Add product
        productCount++;
        // Create the product
        products[productCount] = Product({
            id: productCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender),
            purchased: false,
            desc: _desc
        });
        // Triger an event
        emit ProductCreated({
            id: productCount,
            name: _name,
            price: _price,
            owner: payable(msg.sender),
            purchased: false,
            desc: _desc
        });
    }

    // payable: allow to use `value`
    function purchaseProduct(uint256 _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the procut has valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product has not been purchased already
        // require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        // _product.owner = payable(msg.sender);
        // Mark as purchased
        // _product.purchased = true;
        // Update the product
        // products[_id] = _product;
        // Pay the seller by sending them Ether
        payable(_seller).transfer(msg.value);
        //Add course to enrolled courses
        enrolledCourse[msg.sender].courseList.push(_id);
        //Increase download count of owner
        userDownloads[_seller] += 1;
        totalDownloads[_seller] += 1;
        // Trigger an event
        emit ProductPurchased({
            id: productCount,
            name: _product.name,
            price: _product.price,
            owner: payable(msg.sender),
            purchased: false,
            subscriberList: enrolledCourse[msg.sender].courseList
        });
    }

    function getRewards() public {
        require(userDownloads[msg.sender] >= 5);
        userDownloads[msg.sender] -= 5;
        uint256 reward = 5;
        payable(msg.sender).transfer(reward);
        emit RewardsBalance({
            owner: payable(msg.sender),
            balance: msg.sender.balance
        });
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function getEnrolledCourses() public view returns(uint256[] memory){
        return enrolledCourse[msg.sender].courseList;
    }
}