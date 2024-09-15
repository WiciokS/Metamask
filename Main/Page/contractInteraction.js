// ---- Contract Addresses ----


const reviewsContractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "comment",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            }
        ],
        "name": "addReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDomainContainer",
        "outputs": [
            {
                "internalType": "contract DomainContainer",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getItemContainer",
        "outputs": [
            {
                "internalType": "contract ItemContainer",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReviewContainer",
        "outputs": [
            {
                "internalType": "contract ReviewContainer",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserContainer",
        "outputs": [
            {
                "internalType": "contract UserContainer",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];  // ABI for ReviewsContract
const reviewContainerABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_mainContract",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "comment",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            }
        ],
        "name": "addReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReviews",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "reviewer",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "itemName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "domainName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "comment",
                        "type": "string"
                    },
                    {
                        "internalType": "uint8",
                        "name": "rating",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct ReviewContainer.Review[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];  // ABI for ReviewContainer
const domainContainerABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_mainContract",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "addDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "checkIfDomainExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "checkIfDomainItemReviewsExist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDomains",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct DomainContainer.Domain[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "setTrueDomainItemReviewExistence",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];  // ABI for DomainContainer
const itemContainerABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_mainContract",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "addItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "addItemToDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "rating",
                "type": "uint256"
            }
        ],
        "name": "addRatingForItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "checkIfItemExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "checkIfItemInDomain",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "getItem",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "availableOnDomainNames",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string",
                        "name": "rating",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "domainName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "rating",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct ItemContainer.DomainRating[]",
                        "name": "domainRatings",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct ItemContainer.ReturnableItem",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getItems",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "availableOnDomainNames",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string",
                        "name": "rating",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "domainName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "rating",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct ItemContainer.DomainRating[]",
                        "name": "domainRatings",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct ItemContainer.ReturnableItem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];      // ABI for ItemContainer
const userContainerABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_mainContract",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "checkIfUserReviewedItem",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "checkIfUserReviewedItemOnDomain",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            }
        ],
        "name": "setTrueUserReviewedItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "domainName",
                "type": "string"
            }
        ],
        "name": "setTrueUserReviewedItemOnDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];      // ABI for UserContainer


// ---- MetaMask Connection and Contract Instantiation ----
// Function to connect to MetaMask and dynamically get contract addresses
async function connectToMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        return false;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Assuming you have the address and ABI for ReviewsContract
        const reviewsContractAddress = '0x4487f3032D8FC9b75013e473bA65FE745274d68E'; // Only need to manually specify the ReviewsContract address

            // Instantiate the ReviewsContract
            const reviewsContract = new ethers.Contract(reviewsContractAddress, reviewsContractABI, signer);

            // Fetch the addresses of other contracts dynamically from the ReviewsContract
            const domainContainerAddress = await reviewsContract.getDomainContainer();
            const itemContainerAddress = await reviewsContract.getItemContainer();
            const userContainerAddress = await reviewsContract.getUserContainer();

            // Log the addresses to verify
            console.log('DomainContainer Address:', domainContainerAddress);
            console.log('ItemContainer Address:', itemContainerAddress);
            console.log('UserContainer Address:', userContainerAddress);

            const domainContract = new ethers.Contract(domainContainerAddress, domainContainerABI, signer);
            const itemContract = new ethers.Contract(itemContainerAddress, itemContainerABI, signer);
            const userContract = new ethers.Contract(userContainerAddress, userContainerABI, signer);
            return {
                signer,
                reviewsContract,
                domainContract,
                itemContract,
                userContract
            };
    } catch (error) {
        console.error('Error connecting to MetaMask and fetching contracts:', error);
        return false;
    }
}

// ---- Fetch Reviews ----
async function fetchReviews(reviewsContract, itemName, domainName) {
    try {
        // Get the address of the ReviewContainer
        const reviewContainerAddress = await reviewsContract.getReviewContainer();
        // Instantiate the ReviewContainer contract
        const reviewContainerContract = new ethers.Contract(reviewContainerAddress, reviewContainerABI, reviewsContract.signer);

        // Fetch all reviews from the ReviewContainer
        const reviews = await reviewContainerContract.getReviews();

        // Filter reviews based on item name and domain name
        const filteredReviews = reviews.filter(review => review.itemName === itemName && review.domainName === domainName);

        return filteredReviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// ---- Add a Review ----
async function addReview(reviewsContract, domainName, itemName, comment, rating) {
    try {
        const tx = await reviewsContract.addReview(domainName, itemName, comment, rating);
        console.log('Transaction hash:', tx.hash);
        await tx.wait();
        alert('Review added successfully!');
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

// ---- Check if User Has Reviewed ----
async function hasUserReviewed(userContract, userAddress, itemName) {
    try {
        return await userContract.checkIfUserReviewedItem(userAddress, itemName);
    } catch (error) {
        console.error('Error checking user review:', error);
        return false;
    }
}

// ---- Check if Domain Exists ----
async function checkDomainExists(domainContract, domainName) {
    try {
        return await domainContract.checkIfDomainExists(domainName);
    } catch (error) {
        console.error('Error checking domain existence:', error);
        return false;
    }
}

// ---- Check if Item Exists in Domain ----
async function checkItemExistsInDomain(itemContract, domainName, itemName) {
    try {
        return await itemContract.checkIfDomainItemExists(domainName, itemName);
    } catch (error) {
        console.error('Error checking item existence in domain:', error);
        return false;
    }
}

// ---- Initialize Page with MetaMask and Contract Data ----
async function initPage() {
    // Connect to MetaMask and initialize contracts
    const { signer, reviewsContract, domainContract, itemContract, userContract } = await connectToMetaMask();
    const userAddress = await signer.getAddress();

    // Get dynamic domain and item names from the webpage
    const domainName = window.location.hostname;
    const scriptTag = document.querySelector('script[data-itemname]');
    const itemName = scriptTag.getAttribute('data-itemname');

    // Check if the user has already reviewed this item
    const userReviewed = await hasUserReviewed(userContract, userAddress, itemName);

    // Fetch and display reviews
    const reviews = await fetchReviews(reviewsContract, itemName, domainName);
    console.log("Reviews:", reviews);

    // If the user has not reviewed the item, show the form to add a review
    if (!userReviewed) {
        // Display form or logic to allow review submission
        console.log("User can submit a review.");
    } else {
        console.log("User has already submitted a review.");
    }
}

// ---- Event Listener for Page Load ----
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});