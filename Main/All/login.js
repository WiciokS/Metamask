document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const loginButton = container.querySelector('#loginButton');

    loginButton.addEventListener('click', () => {
        showSection('loginSection');
    });

    // Separate event listener for the MetaMask login button
    container.addEventListener('click', async (event) => {
        if (event.target && event.target.id === 'metaMaskLoginButton') {
            loginWithMetaMask();
        }
    });

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
            console.log('Logged in with ID:', account);

            const balance = await ethersProvider.getBalance(account);
            console.log('Balance:', window.ethers.utils.formatEther(balance), 'ETH');

            alert('Logged in successfully!');

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
});
