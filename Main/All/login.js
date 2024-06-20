document.addEventListener('DOMContentLoaded', () => {
    // Get the container element and the login button
    const container = document.getElementById('myAppContainer');
    const loginButton = container.querySelector('#loginButton');

    // Add event listener to the login button to show the login section
    loginButton.addEventListener('click', () => {
        showSection('loginSection');
    });

    // Separate event listener for the MetaMask login button
    container.addEventListener('click', async (event) => {
        if (event.target && event.target.id === 'metaMaskLoginButton') {
            // Call the MetaMask login function when the MetaMask login button is clicked
            loginWithMetaMask();
        }
    });

    // Function to login with MetaMask
    async function loginWithMetaMask() {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }

        try {
            // Request account access from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const ethersProvider = new window.ethers.providers.Web3Provider(window.ethereum);
            const signer = ethersProvider.getSigner();
            const account = await signer.getAddress();
            console.log('Logged in with ID:', account);

            // Get the account balance
            const balance = await ethersProvider.getBalance(account);
            console.log('Balance:', window.ethers.utils.formatEther(balance), 'ETH');

            alert('Logged in successfully!');

            // Ping the server to confirm login
            fetch('http://84.55.60.45:443/ping')
                .then(response => response.text())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            // Log any errors that occur during the login process
            console.error("Error accessing the Ethereum account:", error);
        }
    }
});
