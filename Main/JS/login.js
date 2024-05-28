document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginSection = document.getElementById('loginSection');

    loginButton.addEventListener('click', () => {
        showSection('loginSection');
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
