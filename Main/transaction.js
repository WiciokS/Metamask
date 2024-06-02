document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const transactionButton = container.querySelector('#transactionButton');
    const submitTransactionButton = container.querySelector('#submitTransactionButton');
    const stars = container.querySelectorAll('.star');
    const ratingValue = container.querySelector('#ratingValue');

    transactionButton.addEventListener('click', () => {
        showSection('transactionSection');
    });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingValue.textContent = `${value}/5`;
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    async function createTransaction() {
        const itemName = container.querySelector('#itemName').value;
        const starRating = ratingValue.textContent.split('/')[0];
        const reviewComment = container.querySelector('#reviewComment').value;

        if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            try {
                if (!window.ethereum.isConnected()) {
                    await window.ethereum.enable();
                }

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log(starRating, reviewComment, itemName, account);

                // Prepare query parameters
                const queryParams = new URLSearchParams({
                    initiator: account
                }).toString();

                // Prepare the body of the request
                const bodyData = JSON.stringify({
                    comment: reviewComment,
                    rating: starRating
                });

                // Send review data to the server
                const response = await fetch(`http://84.55.60.45:443/reviews/${itemName}/add?${queryParams}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: bodyData
                });

                // Get the transaction data from the server response
                const responseData = await response.json();
                console.log(responseData);
                let txData;
                if(responseData.success) {
                    txData = responseData.message;
                } else {
                    alert('Error sending transaction to the server.');
                    return;
                }

                const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

                // Request MetaMask to handle the transaction
                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [txData]
                });

                // Wait for the transaction to be mined
                const transactionReceipt = await ethersProvider.waitForTransaction(txHash);

                alert('Transaction has been sent to the server.');

            } catch (error) {
                console.error("Error creating or signing the transaction:", error);
            }
        } else {
            console.error('MetaMask is not installed!');
            alert('MetaMask is not installed. Please install MetaMask from https://metamask.io/');
        }
    }

    submitTransactionButton.addEventListener('click', createTransaction);
});
