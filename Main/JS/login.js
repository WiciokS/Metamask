window.addEventListener('DOMContentLoaded', async (event) => {
    document.getElementById('loginButton').addEventListener('click', loginWithMetaMask);
    document.getElementById('transactionButton').addEventListener('click', createTransaction);
    document.getElementById('searchButton').addEventListener('click', itemSearch);

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

    function showAccountId(accountId) {
        const displayDiv = document.getElementById('displayId');
        displayDiv.innerHTML = `Logged in with ID: ${accountId}`;
    }

    function showAccountBalance(balance) {
        const balanceDiv = document.getElementById('balance');
        balanceDiv.innerHTML = `Balance: ${window.ethers.utils.formatEther(balance)} ETH`;
    }
});

async function createTransaction() {
    const itemName = document.getElementById('itemName').value;
    const starRating = document.getElementById('starRating').value;
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

        // Calculate the gas price and gas limit
        const gasPrice = await ethersProvider.getGasPrice();
        const gasLimit = 100000; // Adjusted to a reasonable estimate

        // Define the cost based on your contract requirements, convert to Wei if necessary
        const cost = ethers.utils.parseEther('0.00001'); // Example cost in Ether

        // Create contract instance
        const contract = new ethers.Contract(ContractAddress, ContractABI, signer, { gasLimit: 1000000 });


        // Generate transaction data
        const tx = await contract.populateTransaction.processReview(cost, {
            value: cost,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        });

        // Send the transaction directly from the user's wallet
        const transactionResponse = await signer.sendTransaction(tx);

        // Wait for the transaction to be mined
        const transactionReceipt = await transactionResponse.wait();

        // Construct review data
        const reviewData = {
            itemName: itemName,
            review: {

                starRating: starRating,
                comment: reviewComment,
                walletAddress: account
            },
            tx: transactionReceipt

        };

        // Send data to the server
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

async function itemSearch() {
    const itemName = document.getElementById('ItemNameSearch').value;
    const domainName = document.getElementById('DomainSearch').value;

    // Construct the query string
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
        // Send a GET request to the /getItemReviews endpoint with the query string
        const response = await fetch(`http://84.55.60.45:443/getItemReviews?${queryString}`);

        // Parse the JSON response
        const data = await response.json();

        // Display the review data on the page
        console.log(data);
        // Here you can add code to display the data on your webpage

    } catch (error) {
        console.error("Error fetching item reviews:", error);
    }
}
