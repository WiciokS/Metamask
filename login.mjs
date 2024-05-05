import detectEthereumProvider from '@metamask/detect-provider';

document.getElementById('loginButton').addEventListener('click', async () => {
    const provider = await detectEthereumProvider();

    if (provider && provider === window.ethereum) {
        try {
            // Request account access specifically from MetaMask
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            showAccountId(account);
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

function showAccountId(accountId) {
    const displayDiv = document.getElementById('displayId');
    displayDiv.innerHTML = `Logged in with ID: ${accountId}`;
}
