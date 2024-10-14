// Reviews Contract ABI and address
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

// Example usage:



let provider, signer;

/**
 * Function to connect to MetaMask and set up signer
 */
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

/**
 * Function to get the DomainContainer address from the ReviewsContract
 * and then use the DomainContainer to fetch the list of domains.
 */
async function getAllRegisteredDomains() {
    try {
        const reviewsContractABI = await loadABI('ReviewsContract');
        console.log("reviewsContractABI", reviewsContractABI);
        const domainContainerABI = await loadABI('DomainContainer');

        // Initialize ReviewsContract
        const reviewsContract = new ethers.Contract(reviewsContractAddress, reviewsContractABI, signer);

        // Fetch the DomainContainer address from ReviewsContract
        const domainContainerAddress = await reviewsContract.getDomainContainer();
        console.log("DomainContainer Address:", domainContainerAddress);

        // Initialize the DomainContainer using its address and ABI
        const domainContainer = new ethers.Contract(domainContainerAddress, domainContainerABI, signer);

        // Call the getDomains function from DomainContainer
        const domains = await domainContainer.getDomains();
        if (domains.length === 0) {
            console.log('No registered domains found.');
            alert('No domains have been registered.');
        } else {
            console.log('Registered Domains:', domains);
            displayDomains(domains);  // Display domains in the UI
        }
    } catch (error) {
        console.error("Error fetching domains:", error);
        alert('Error fetching domains. Please try again.');
    }
}

/**
 * Function to display the list of domains in the UI
 * @param {Array} domains - Array of registered domains.
 */
function displayDomains(domains) {
    const domainListDiv = document.getElementById('domainList');
    domainListDiv.innerHTML = '';  // Clear any previous content

    domains.forEach(domain => {
        const domainItem = document.createElement('p');
        domainItem.innerText = domain;
        domainListDiv.appendChild(domainItem);
    });
}

