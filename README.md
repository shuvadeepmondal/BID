![image](https://github.com/user-attachments/assets/481b01fb-447b-4b21-a682-6ed0ec7014d8)

It is a on-campus platform catering to the needs of selling and refurbishing thier old products to earn money as a side hussle. Providing users features of delivey on campus product selling and bargaining. We provide secure transaction via paying by Crypto AVAX in the Avalance Network, using eigen layer for abstraction and security.

**This project was build in the [Binary Hackathon by KGEC](https://binary.kgec.tech/)**

## Tech Stack

<div align="center" style="padding: 40px;">

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## Application Architecture

![image](https://github.com/user-attachments/assets/eff604e1-1f20-4edf-bd92-a3d6f7e9a4aa)

Our application follows a modern web architecture with the following components:

### Frontend

- **React**: Core UI library for building interactive components
- **TypeScript**: Adds static typing to improve code quality and maintainability
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Third-party Web SDK**: Integrates with external services

### Backend

- **Express**: Node.js web application framework for the server
- **TypeScript**: Used across both frontend and backend for consistent development experience
- **Mongoose**: MongoDB object modeling tool for data management

### Blockchain Integration

- **Solidity Smart Contract**: Powers our decentralized functionality
- **Avalanche Network**: The blockchain platform our application interacts with

The architecture enables seamless communication between the frontend and backend while providing blockchain capabilities through the Third-party Web SDK that connects to our Solidity Smart Contract deployed on the Avalanche Network.

## Smart Contract

![image](https://github.com/user-attachments/assets/7676cdaf-5a67-4674-ac1e-e48be785d6e4)

The Smart Contract consists of Three functions:

### purchaseProduct()

When the function is called a transaction takes place in this Smart-Contract were the user plays the sum in **AVAX** which is on Avalanche Network.

```sol
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
```

### getPurchaseDetails()

It is view function which gives details about the tranaction and the product.

```sol
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
```

### hasProductOwnership()

A viewing function which verifies who is the owner of the project.

```sol
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
```

## Contributing

We welcome contributions to improve this application! Here's how you can contribute:

1. Fork the repository [BID](https://github.com/Puskar-Roy/BID)
2. Clone the repository
3. Create a new branch (`git checkout -b feature/your-feature-name`)
4. Make your changes
5. Run tests to ensure everything works as expected
6. Commit your changes (`git commit -m 'Add some feature'`)
7. Push to the branch (`git push origin feature/your-feature-name`)
8. Open a Pull Request

Please make sure to follow our coding standards and keep your code clean and well-documented. For major changes, please open an issue first to discuss what you would like to change.

## Our Contributors
<div align="center" style="padding: 40px;">
    <a href="https://github.com/Puskar-Roy/BID/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Puskar-Roy/BID" />
    </a>
</div>


## Conclusion

This project combines modern web development technologies with blockchain capabilities to create a robust and scalable application. The architecture is designed to be modular and maintainable, allowing for future expansions and improvements.

By leveraging React and TypeScript on the frontend, Express and Mongoose on the backend, and integrating with the Avalanche Network through Solidity Smart Contracts, we've built a comprehensive solution that balances user experience with decentralized functionality.

We're continuously working to improve this application and welcome feedback and contributions from the community.
