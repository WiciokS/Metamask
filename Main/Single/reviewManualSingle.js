document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const submitTransactionButton = container.querySelector('#submitTransactionButton');
    const stars = container.querySelectorAll('.star');
    const ratingValue = container.querySelector('#ratingValue');

    // Event listeners for star rating selection
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

    // Function to create a transaction with a manually set item name
    async function createTransaction() {
        const itemName = document.querySelector('#myVariable').getAttribute('data-value');
        console.log(itemName); // Outputs: Probably Last Test
        const starRating = ratingValue.textContent.split('/')[0];
        const reviewComment = container.querySelector('#reviewComment').value;

        // Check if MetaMask is installed
        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }
        try {
            // Request account access from MetaMask
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
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
            if (responseData.success) {
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
    }

    submitTransactionButton.addEventListener('click', createTransaction);
});
