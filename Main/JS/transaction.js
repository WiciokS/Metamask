document.addEventListener('DOMContentLoaded', () => {
    const transactionButton = document.getElementById('transactionButton');
    const submitTransactionButton = document.getElementById('submitTransactionButton');
    const transactionSection = document.getElementById('transactionSection');
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');

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

    submitTransactionButton.addEventListener('click', createTransaction);

    async function createTransaction() {
        const itemName = document.getElementById('itemName').value;
        const starRating = ratingValue.textContent.split('/')[0];
        const reviewComment = document.getElementById('reviewComment').value;

        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // Construct the URL with query parameters
            const url = `http://84.55.60.45:443/reviews/${itemName}/add?initiator=${account}`;

            // Construct the body data
            const bodyData = {
                comment: reviewComment,
                rating: starRating.toString()
            };

            // Send review data to the server
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });

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

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txData]
            });

            const transactionReceipt = await ethersProvider.waitForTransaction(txHash);

            alert('Transaction has been sent to the server.');

        } catch (error) {
            console.error("Error creating or signing the transaction:", error);
        }
    }
});
