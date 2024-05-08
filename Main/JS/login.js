window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', async () => {
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
        } catch (error) {
            console.error("Error accessing the Ethereum account:", error);
        }
    });

    function showAccountId(accountId) {
        const displayDiv = document.getElementById('displayId');
        displayDiv.innerHTML = `Logged in with ID: ${accountId}`;
    }

    function showAccountBalance(balance) {
        const balanceDiv = document.getElementById('balance');
        balanceDiv.innerHTML = `Balance: ${window.ethers.utils.formatEther(balance)} ETH`;
    }
});
