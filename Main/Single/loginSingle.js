document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const loginButton = container.querySelector('#metaMaskLoginButton');

    // Separate event listener for the MetaMask login button
    loginButton.addEventListener('click', async () => {
        loginWithMetaMask();
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
        } catch (error) {
            console.error("Error accessing the Ethereum account:", error);
        }
    }
});
