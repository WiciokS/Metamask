document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const loginButton = document.getElementById('loginButton');
    const transactionButton = document.getElementById('transactionButton');
    const searchButton = document.getElementById('searchButton');
    const loginSection = document.getElementById('loginSection');
    const transactionSection = document.getElementById('transactionSection');
    const searchSection = document.getElementById('searchSection');
    const submitTransactionButton = document.getElementById('submitTransactionButton');
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');

    // Event listeners for sidebar buttons
    loginButton.addEventListener('click', () => {
        showSection('loginSection');
        loginWithMetaMask();
    });

    transactionButton.addEventListener('click', () => {
        showSection('transactionSection');
    });

    searchButton.addEventListener('click', () => {
        showSection('searchSection');
    });

    // Event listener for star rating
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingValue.textContent = `${value}/5`;
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    // Function to show the appropriate section
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.classList.remove('hidden');
            } else {
                section.classList.remove('active');
                section.classList.add('hidden');
            }
        });
    }

    // Login with MetaMask
    async function loginWithMetaMask() {
        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const ethersProvider = new window.ethers.providers.Web3Provider(window.ethereum);
            const signer = ethersProvider.getSigner();
            const account = await signer.getAddress();
            showAccountId(account);

            const balance = await ethersProvider.getBalance(account);
            showAccountBalance(balance);

            fetch('http://84.55.60.45:443/ping')
                .then(response => response.text())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error("Error accessing the Ethereum account:", error);
        }
    }

    // Function to display account ID
    function showAccountId(accountId) {
        const displayDiv = document.getElementById('displayId');
        displayDiv.innerHTML = `Logged in with ID: ${accountId}`;
    }

    // Function to display account balance
    function showAccountBalance(balance) {
        const balanceDiv = document.getElementById('balance');
        balanceDiv.innerHTML = `Balance: ${window.ethers.utils.formatEther(balance)} ETH`;
    }

    // Create Transaction
    async function createTransaction() {
        const itemName = document.getElementById('itemName').value;
        const starRating = document.querySelector('.star.selected') ? document.querySelector('.star.selected').getAttribute('data-value') : 0;
        const reviewComment = document.getElementById('reviewComment').value;

        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }

        try {
            const ContractABI = [
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_item",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_ipfsHash",
                            "type": "string"
                        }
                    ],
                    "name": "modifyItemIPFSHash",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "cost",
                            "type": "uint256"
                        }
                    ],
                    "name": "processReview",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_item",
                            "type": "string"
                        }
                    ],
                    "name": "getItemIPFSHash",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const ContractAddress = '0xE124f646A023DA7DBec9978878e590fC1046Fc2E'; // Replace with your contract address

            const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = ethersProvider.getSigner();

            // Create contract instance
            const contract = new ethers.Contract(ContractAddress, ContractABI, signer);

            // Estimate gas limit
            const gasLimitEstimate = await contract.estimateGas.processReview(ethers.utils.parseEther('0.0001'), {
                value: ethers.utils.parseEther('0.0001')
            });

            // Prepare transaction data
            const txData = {
                from: account,
                to: ContractAddress,
                data: contract.interface.encodeFunctionData("processReview", [ethers.utils.parseEther('0.0001')]), // Update with your function and parameters
                value: ethers.utils.parseEther('0.0001').toHexString(),
                gas: gasLimitEstimate.toHexString()
            };

            // Request MetaMask to suggest gas fees and handle the transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txData]
            });

            // Wait for the transaction to be mined
            const transactionReceipt = await ethersProvider.waitForTransaction(txHash);

            const reviewData = {
                itemName: itemName,
                review: {
                    starRating: starRating,
                    comment: reviewComment,
                    walletAddress: account
                },
                tx: transactionReceipt
            };

            fetch('http://84.55.60.45:443/uploadReview ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Transaction response:', data);
                    alert('Transaction has been sent to the server.');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        } catch (error) {
            console.error("Error creating or signing the transaction:", error);
        }
    }

    // Search Items
    async function itemSearch() {
        const itemName = document.getElementById('ItemNameSearch').value;
        const domainName = document.getElementById('DomainSearch').value;

        let queryString = '';
        if (itemName) {
            queryString += `itemName=${encodeURIComponent(itemName)}`;
        }
        if (domainName) {
            if (queryString) {
                queryString += '&';
            }
            queryString += `domainName=${encodeURIComponent(domainName)}`;
        }

        try {
            const response = await fetch(`http://84.55.60.45:443/getItemReviews?${queryString}`);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching item reviews:", error);
        }
    }

    // Event listeners for transaction and search functionality
    submitTransactionButton.addEventListener('click', createTransaction);
    document.getElementById('performSearchButton').addEventListener('click', itemSearch);
});
