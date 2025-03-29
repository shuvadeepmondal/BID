// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductPurchaseContract {
    // Struct to store product purchase details
    struct ProductPurchase {
        string name;
        string description;
        uint256 productId;
        address authorAddress;
        uint256 authorId;
        uint256 price;
        uint256 transactionTime;
        address owner;
    }

    // Struct for returning purchase details
    struct PurchaseDetails {
        string name;
        string description;
        uint256 productId;
        address authorAddress;
        uint256 price;
        uint256 transactionTime;
        address owner;
    }

    // Mapping to store product purchases by productId and owner
    mapping(uint256 => mapping(address => ProductPurchase))
        private productPurchases;

    // Track if a product has been purchased by an address
    mapping(uint256 => mapping(address => bool)) private productOwnership;

    // Track all products by ID to their author address
    mapping(uint256 => address) private productAuthors;

    // Admin address for platform fee collection
    address private owner;

    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 private platformFeePercentage = 250;

    // Events
    event ProductPurchased(
        uint256 indexed productId,
        address indexed buyer,
        address indexed author,
        uint256 price,
        uint256 transactionTime
    );

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Purchase a product, collecting payment and distributing to author
     * @param _productId Unique identifier for the product
     * @param _name Name of the product
     * @param _description Description of the product
     * @param _authorId Identifier for the product author
     * @param _authorAddress Wallet address of the author to receive payment
     * @param _price Price of the product in wei
     */
    function purchaseProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _authorId,
        address _authorAddress,
        uint256 _price
    ) public payable {
        // Ensure the sent amount matches the product price
        require(msg.value >= _price, "Insufficient payment");

        // Check if the product is not already owned by the buyer
        require(
            !productOwnership[_productId][msg.sender],
            "Product already owned"
        );

        // Verify author address is valid
        require(_authorAddress != address(0), "Invalid author address");

        // Store the product purchase
        ProductPurchase memory newPurchase = ProductPurchase({
            name: _name,
            description: _description,
            productId: _productId,
            authorAddress: _authorAddress,
            authorId: _authorId,
            price: _price,
            transactionTime: block.timestamp,
            owner: msg.sender
        });

        // Record the purchase details
        productPurchases[_productId][msg.sender] = newPurchase;

        // Mark product as owned by the buyer
        productOwnership[_productId][msg.sender] = true;

        // Save author address for product if not already set
        if (productAuthors[_productId] == address(0)) {
            productAuthors[_productId] = _authorAddress;
        }

        // Calculate platform fee
        uint256 platformFee = (_price * platformFeePercentage) / 10000;

        // Calculate author payment
        uint256 authorPayment = _price - platformFee;

        // Transfer platform fee to contract owner
        (bool platformSuccess, ) = payable(owner).call{value: platformFee}("");
        require(platformSuccess, "Platform fee transfer failed");

        // Transfer author payment
        (bool authorSuccess, ) = payable(_authorAddress).call{
            value: authorPayment
        }("");
        require(authorSuccess, "Author payment transfer failed");

        // Emit purchase event
        emit ProductPurchased(
            _productId,
            msg.sender,
            _authorAddress,
            _price,
            block.timestamp
        );

        // Refund any excess payment
        if (msg.value > _price) {
            (bool refundSuccess, ) = payable(msg.sender).call{
                value: msg.value - _price
            }("");
            require(refundSuccess, "Refund transfer failed");
        }
    }

    /**
     * @dev Retrieve product purchase details for caller
     * @param _productId Unique identifier for the product
     * @return PurchaseDetails struct with product details
     */
    function getPurchaseDetails(
        uint256 _productId
    ) public view returns (PurchaseDetails memory) {
        // Ensure the product has been purchased by caller
        require(
            productOwnership[_productId][msg.sender],
            "You don't own this product"
        );

        ProductPurchase memory purchase = productPurchases[_productId][
            msg.sender
        ];

        return
            PurchaseDetails({
                name: purchase.name,
                description: purchase.description,
                productId: purchase.productId,
                authorAddress: purchase.authorAddress,
                price: purchase.price,
                transactionTime: purchase.transactionTime,
                owner: purchase.owner
            });
    }

    /**
     * @dev Check if a user owns a specific product
     * @param _productId Unique identifier for the product
     * @param _user Address of the user
     * @return bool indicating product ownership
     */
    function hasProductOwnership(
        uint256 _productId,
        address _user
    ) public view returns (bool) {
        return productOwnership[_productId][_user];
    }
}
