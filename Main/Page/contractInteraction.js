// ---- Contract Addresses ----
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
        const reviewsContractAddress = '0x2666D993C0D2542Bbaa50aDe2a51be35d93ed383'; // Only need to manually specify the ReviewsContract address


            // Load the ABIs for other contracts
            const reviewsContractABI = await loadABI('ReviewsContract');
            const domainContainerABI = await loadABI('DomainContainer');
            const itemContainerABI = await loadABI('ItemContainer');
            const userContainerABI = await loadABI('UserContainer');


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
        const reviewContainerABI = await loadABI('ReviewContainer');
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