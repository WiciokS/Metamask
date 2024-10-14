

(async () => {
    // Get the domain name from the script tag
    const scriptTag = document.currentScript;
    const domainName = scriptTag.getAttribute('data-domainName');

    if (!domainName) {
        console.error('Domain name not provided in the script tag');
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



        // Contract interaction function to bind the domain to the user's address
        async function bindDomainToOwner(domainName) {
            const reviewsContractABI = await loadABI('ReviewsContract');
            const reviewsContract = new ethers.Contract(reviewsContractAddress, reviewsContractABI, signer);

            try {
            // Bind the domain to the user's address
            await reviewsContract.bindAddressToDomain(domainName, signer.getAddress());
            console.log(`Domain '${domainName}' successfully registered and bound to your address.`);
        } catch (error) {
            console.error("Error binding domain:", error);
            alert('Error binding domain. Please try again.');
        }
        }

        // Automatically connect to MetaMask and register the domain
        async function registerDomain() {
            await connectToMetaMask();
            if (signer) {
            await bindDomainToOwner(domainName);
        }
        }

        // Trigger the domain registration
        await registerDomain();

        })();
