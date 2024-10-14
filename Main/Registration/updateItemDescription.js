(async () => {
    // Get the domain name and item name from the script tag
    const scriptTag = document.currentScript;
    const domainName = scriptTag.getAttribute('data-domainName');
    const itemName = scriptTag.getAttribute('data-itemName');

    if (!domainName || !itemName) {
        console.error('Domain name or item name not provided in the script tag');
        return;
    }

    // MetaMask connection and signer setup
    let provider, signer;

    async function connectToMetaMask() {
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                console.log('MetaMask connected');
            } catch (error) {
                console.error("MetaMask connection failed:", error);
                alert('Failed to connect to MetaMask. Please try again.');
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    }

    // Contract ABIs and addresses
    const reviewsContractAddress = '0x2666D993C0D2542Bbaa50aDe2a51be35d93ed383';  // Replace with your contract address
    // Function to load the ABI based on contract name
    async function loadABI(contractName) {
        const filePath = `../abis/${contractName}.json`;  // Dynamically generate the file path
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ABI from ${filePath}`);
            }
            // No need to parse again, response.json() already returns the parsed JSON object
            const json = await response.json();
            return json.abi;  // Directly return the abi from the JSON
        } catch (error) {
            console.error("Error loading ABI:", error);
            throw error;
        }
    }

    // Fetch domain owner from DomainContainer
    async function checkDomainOwnership() {
        // Load the contract ABIs
        const reviewsContractABI = await loadABI('ReviewsContract');
        const domainContainerABI = await loadABI('DomainContainer');

        // Initialize the contracts
        const reviewsContract = new ethers.Contract(reviewsContractAddress, reviewsContractABI, signer);
        const domainContainerAddress = await reviewsContract.getDomainContainer();
        const domainContainer = new ethers.Contract(domainContainerAddress, domainContainerABI, signer);

        // Fetch the owner of the domain
        const ownerAddress = await domainContainer.getDomainOwner(domainName);
        const userAddress = await signer.getAddress();

        if (ownerAddress.toLowerCase() !== userAddress.toLowerCase()) {
            alert('You are not the owner of this domain and cannot change the item description.');
            throw new Error('Only domain owner can set the description');
        }
    }

    // Set item description
    async function setItemDescription(newDescription) {
        // Load the contract ABI
        const reviewsContractABI = await loadABI('ReviewsContract');

        // Initialize the contract
        const reviewsContract = new ethers.Contract(reviewsContractAddress, reviewsContractABI, signer);

        try {
            // Check if the user owns the domain
            await checkDomainOwnership();

            // Call setItemDescription to update the description
            await reviewsContract.setItemDescription(itemName, domainName, newDescription);
            console.log(`Item description for '${itemName}' updated under domain '${domainName}'`);
            alert(`Item description updated successfully!`);
        } catch (error) {
            console.error("Error setting item description:", error);
            alert('Error updating item description. Please try again.');
        }
    }

    // Handle form submission
    document.getElementById('descriptionForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const newDescription = document.getElementById('itemDescription').value;

        if (!newDescription) {
            alert('Please enter a valid description.');
            return;
        }

        await connectToMetaMask();
        await setItemDescription(newDescription);
    });

})();
