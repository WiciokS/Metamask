
# MetaMask Integration Project

## Overview

This project integrates MetaMask functionalities with a web interface, allowing users to interact with blockchain-based services such as logging in, submitting reviews, registering items, searching for items and domains, and fetching item information. The project is divided into several components, each handling a specific functionality.

## Project Structure

### Main Directory
- `index.html`: Main HTML file that includes sections for login, transaction, review, search, item info, and item registration functionalities.
- `itemInfo.js`: Handles fetching and displaying item information.
- `login.js`: Manages MetaMask login functionality.
- `registerItem.js`: Manages item registration and checking registration status.
- `review.js`: Handles review submissions.
- `search.js`: Manages search functionalities for items, domains, user reviews, and item reviews in domains.
- `showSection.js`: Utility script for showing and hiding sections.
- `styles.css`: Contains styles for the entire application.

### Single Directory
- `itemInfoSingle.html`: HTML file for testing item info functionality in isolation.
- `itemInfoSingle.js`: JS file for handling item info functionality in isolation.
- `loginSingle.html`: HTML file for testing MetaMask login functionality in isolation.
- `loginSingle.js`: JS file for handling MetaMask login functionality in isolation.
- `registerItemSingle.html`: HTML file for testing item registration functionality in isolation.
- `registerItemSingle.js`: JS file for handling item registration functionality in isolation.
- `reviewManualSingle.html`: HTML file for testing manual review functionality in isolation.
- `reviewManualSingle.js`: JS file for handling manual review functionality in isolation.
- `reviewSingle.html`: HTML file for testing review functionality in isolation.
- `reviewSingle.js`: JS file for handling review functionality in isolation.
- `searchSingle.html`: HTML file for testing search functionality in isolation.
- `searchSingle.js`: JS file for handling search functionality in isolation.

## Detailed Explanation

### index.html
The main HTML file that includes buttons for different functionalities and sections that will display the content for each functionality. It dynamically loads HTML content from the `Single` directory for each functionality.

### itemInfo.js
Handles fetching and displaying item information from the server.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const itemInfoButton = container.querySelector('#itemInfoButton');

    itemInfoButton.addEventListener('click', () => {
        showSection('itemInfoSection');
    });

    async function itemInfoSearch(check) {
        clearItemInfoResults();
        const itemName = container.querySelector('#ItemNameInfoSearch').value;
        console.log('Item Name:', itemName);

        try {
            const response = await fetch(`http://84.55.60.45:443/items/${itemName}/info?useMapping=${check}`);
            const data = await response.json();

            if (data.success) {
                const itemInfo = data.message;
                console.log('Item Info Data:', itemInfo);

                displayItemInfo(itemInfo);
            } else {
                alert('Error fetching item info.');
            }
        } catch (error) {
            console.error("Error fetching item info:", error);
        }
    }

    function clearItemInfoResults() {
        const itemInfoResults = container.querySelector('#itemInfoResults');
        itemInfoResults.innerHTML = '';
    }

    function displayItemInfo(itemInfo) {
        const itemInfoResults = container.querySelector('#itemInfoResults');
        const imagesHtml = itemInfo.Images.map(image => `<img src="${image}" alt="${itemInfo['Item Name']}" style="max-width: 100%; height: auto; display: block; margin-bottom: 10px;" />`).join('');
        itemInfoResults.innerHTML = `
            <h2>Item Name: ${itemInfo['Item Name']}</h2>
            <p>Alternate Name: ${itemInfo['Alternate Name']}</p>
            <p>Description: ${itemInfo['Description']}</p>
            <div>${imagesHtml}</div>
        `;
    }

    container.querySelector('#performItemInfoSearchButton').addEventListener('click', () => itemInfoSearch(true));
    container.querySelector('#performItemInfoSearchButton2').addEventListener('click', () => itemInfoSearch(false));
});
```

### login.js
Manages MetaMask login functionality, fetching account details and displaying them.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const loginButton = container.querySelector('#loginButton');

    loginButton.addEventListener('click', () => {
        showSection('loginSection');
    });

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
```

### registerItem.js
Handles item registration and checking registration status.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const registerItemButton = container.querySelector('#registerItemButton');
    const submitRegisterItem = container.querySelector('#registerItem');
    const checkItemRegistration = container.querySelector('#checkItemRegistration');

    registerItemButton.addEventListener('click', () => {
        showSection('registerItemSection');
    });

    async function registerItem() {
        const itemName = container.querySelector('#itemNameRegister').value;
        console.log('Item Name:', itemName);

        const queryParams = new URLSearchParams({
            itemName: itemName
        }).toString();

        try {
            const response = await fetch(`http://84.55.60.45:443/registrations/register?${queryParams}`, {
                method: 'POST'
            });
            alert('Item successfully added to the registration queue!')
        } catch (error) {
            console.error("Error registering item:", error);
        }
    }

    async function checkRegistration() {
        const itemName = container.querySelector('#itemNameRegister').value;

        try {
            const response = await fetch(`http://84.55.60.45:443/registrations/items/${itemName}` , {
                method: 'GET'
            });
            const data = await response.json();

                if (data.success) {
                    console.log(data.message);
                    alert('Item is registered!');
                } else {
                    alert('Item is not registered!');
                }

            } catch (error) {
                console.error("Error checking registration:", error);
            }
    }

    submitRegisterItem.addEventListener('click', registerItem);
    checkItemRegistration.addEventListener('click', checkRegistration);
});
```

### review.js
Handles review submissions.

```javascript
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

        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            alert('Please install MetaMask!');
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            console.log(starRating, reviewComment, itemName, account);
            const queryParams = new URLSearchParams({
                initiator: account
            }).toString();
            const bodyData = JSON.stringify({
                comment: reviewComment,
                rating: starRating
            });
            const response = await fetch(`http://84.55.60.45:443/reviews/${itemName}/add?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: bodyData
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

    submitTransactionButton.addEventListener('click', createTransaction);
});
```

### search.js
Manages search functionalities for items, domains, user reviews, and item reviews in domains.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const searchButton = container.querySelector('#searchButton');
    const searchOptions = [
        { id: 'performSearchButton', label: 'Item', handler: itemSearch },
        { id: 'performDomainSearchButton', label: 'Domain', handler: domainSearch },
        { id: 'performUserSearchButton', label: 'User Reviews', handler: userSearch },
        { id: 'performItemInDomainSearchButton', label: 'Item in Domain', handler: itemInDomainSearch }
    ];

    searchButton.addEventListener('click', () => {
        showSection('dynamicSection');
        loadSearchOptions();
    });

    function loadSearchOptions() {
        const dynamicSection = container.querySelector('#dynamicSection');
        dynamicSection.innerHTML = `
            <div class="search-options">
                ${searchOptions.map(option => `<button id="${option.id}">${option.label}</button>`).join('')}
            </div>
            <div id="searchContent" class="search-content"></div>
            <div id="searchResults"></div>
        `;

        searchOptions.forEach(option => {
            container.querySelector(`#${option.id}`).addEventListener('click', () => {
                clearSearchContent();
                option.handler();
            });
        });
    }

    function clearSearchContent() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = '';
        const searchResults = container.querySelector('#searchResults');
        searchResults.innerHTML = '';
    }

    async function itemSearch() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = `
            <input type="text" id="ItemNameSearch" placeholder="Enter item name">
            <button id="performItemSearch">Search Item</button>
        `;
        container.querySelector('#performItemSearch').addEventListener('click', async () => {
            clearResults();
            const itemName = container.querySelector('#ItemNameSearch').value;
            console.log('Item Name:', itemName);

            try {
                const itemResponse = await fetch(`http://84.55.60.45:443/items/${itemName}`);
                const itemData = await itemResponse.json();

                if (itemData.success) {
                    const items = itemData.message;
                    console.log('Item Data:', items);

                    displayItemData(items);

                    const reviewsResponse = await fetch(`http://84.55.60.45:443/reviews/${itemName}`);
                    const reviewsData = await reviewsResponse.json();

                    if (reviewsData.success) {
                        const reviews = reviewsData.message;
                        console.log('Reviews Data:', reviews);

                        displayReviews(reviews);
                    } else {
                        alert('Error fetching reviews for the item.');
                    }
                } else {
                    alert('Error fetching item data.');
                }
            } catch (error) {
                console.error("Error fetching item data or reviews:", error);
            }
        });
    }

    async function domainSearch() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = `
            <input type="text" id="DomainNameSearch" placeholder="Enter domain name">
            <button id="performDomainSearch">Search Domain</button>
        `;
        container.querySelector('#performDomainSearch').addEventListener('click', async () => {
            clearResults();
            const domainName = container.querySelector('#DomainNameSearch').value;
            console.log('Domain Name:', domainName);

            try {
                const domainResponse = await fetch(`http://84.55.60.45:443/domains/${domainName}`);
                const domainData = await domainResponse.json();

                if (domainData.success) {
                    const domains = domainData.message;
                    console.log('Domain Data:', domains);

                    displayDomainData(domains);

                    let reviewsResponse;
                    if (domainName === "") {
                        reviewsResponse = await fetch(`http://84.55.60.45:443/reviews/${domainName}`);
                    } else {
                        reviewsResponse = await fetch(`http://84.55.60.45:443/reviews/domains/${domainName}`);
                    }
                    const reviewsData = await reviewsResponse.json();

                    if (reviewsData.success) {
                        const reviews = reviewsData.message;
                        console.log('Reviews Data:', reviews);

                        displayReviews(reviews);
                    } else {
                        alert('Error fetching reviews for the domain.');
                    }
                } else {
                    alert('Error fetching domain data.');
                }
            } catch (error) {
                console.error("Error fetching domain data or reviews:", error);
            }
        });
    }

    async function userSearch() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = `
            <input type="text" id="UserAddressSearch" placeholder="Enter user address">
            <button id="performUserSearch">Search User Reviews</button>
        `;
        container.querySelector('#performUserSearch').addEventListener('click', async () => {
            clearResults();
            const userAddress = container.querySelector('#UserAddressSearch').value;
            console.log('User Address:', userAddress);

            try {
                const userResponse = await fetch(`http://84.55.60.45:443/reviews/user/${userAddress}`);
                const userData = await userResponse.json();

                if (userData.success) {
                    const reviews = userData.message;
                    console.log('User Reviews Data:', reviews);

                    displayReviews(reviews);
                } else {
                    alert('Error fetching reviews for the user.');
                }
            } catch (error) {
                console.error("Error fetching user reviews:", error);
            }
        });
    }

    async function itemInDomainSearch() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = `
            <input type="text" id="ItemNameInDomainSearch" placeholder="Enter item name in domain">
            <input type="text" id="DomainNameForItemSearch" placeholder="Enter domain name for item">
            <button id="performItemInDomainSearch">Search Item in Domain</button>
        `;
        container.querySelector('#performItemInDomainSearch').addEventListener('click', async () => {
            clearResults();
            const itemName = container.querySelector('#ItemNameInDomainSearch').value;
            const domainName = container.querySelector('#DomainNameForItemSearch').value;
            console.log('Item Name:', itemName);
            console.log('Domain Name:', domainName);

            try {
                const reviewsResponse = await fetch(`http://84.55.60.45:443/reviews/domains/${domainName}/items/${itemName}`);
                const reviewsData = await reviewsResponse.json();

                if (reviewsData.success) {
                    const reviews = reviewsData.message;
                    console.log('Reviews for Item in Domain Data:', reviews);

                    displayReviews(reviews);
                } else {
                    alert('Error fetching reviews for the item in the domain.');
                }
            } catch (error) {
                console.error("Error fetching reviews for the item in the domain:", error);
            }
        });
    }

    function clearResults() {
        const searchResults = container.querySelector('#searchResults');
        searchResults.innerHTML = '';
    }

    function displayItemData(items) {
        const searchResults = container.querySelector('#searchResults');
        if (Array.isArray(items)) {
            const itemsHtml = items.map(item => `
                <div class="item">
                    <h2>Item: ${item.name}</h2>
                    <p>Average Rating: ${item.rating}</p>
                    <p>Available on Domains: ${item.availableOnDomainNames.join(', ')}</p>
                </div>
            `).join('');
            searchResults.innerHTML = `
                <h3>Items:</h3>
                <div class="items-container">
                    ${itemsHtml}
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <h2>Item: ${items.name}</h2>
                <p>Average Rating: ${items.rating}</p>
                <p>Available on Domains: ${items.availableOnDomainNames.join(', ')}</p>
            `;
        }
    }

    function displayDomainData(domains) {
        const searchResults = container.querySelector('#searchResults');
        if (Array.isArray(domains)) {
            const domainsHtml = domains.map(domain => `
                <div class="domain">
                    <h2>Domain: ${decodeURIComponent(domain.name)}</h2>
                </div>
            `).join('');
            searchResults.innerHTML = `
                <h3>Domains:</h3>
                <div class="domains-container">
                    ${domainsHtml}
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <h2>

Domain: ${decodeURIComponent(domains.name)}</h2>
            `;
        }
    }

    function displayReviews(reviews) {
        const searchResults = container.querySelector('#searchResults');
        const reviewsHtml = reviews.map(review => `
            <div class="review">
                <p><strong>Reviewer:</strong> ${review.reviewer}</p>
                <p><strong>Item:</strong> ${review.itemName}</p>
                <p><strong>Rating:</strong> ${review.rating}</p>
                <p><strong>Comment:</strong> ${review.comment}</p>
            </div>
        `).join('');
        searchResults.innerHTML += `
            <h3>Reviews:</h3>
            <div class="reviews-container">
                ${reviewsHtml}
            </div>
        `;
    }
});
```

### showSection.js
Utility script for showing and hiding sections.

```javascript
function showSection(sectionId) {
    const container = document.getElementById('myAppContainer');
    const sections = container.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
            section.classList.remove('hidden');
        } else {
            section.classList.remove('active');
            section.classList.add('hidden');
        }
    });
}
```

## Usage Instructions

1. **Login with MetaMask**
    - Click on the "Login" button in the sidebar.
    - Click on "Login to MetaMask" to connect your MetaMask wallet.

2. **Register an Item**
    - Click on the "Register an Item" button in the sidebar.
    - Enter the item name and click "Register Item" to add the item to the registration queue.
    - Click "Check Registration" to verify if the item is registered.

3. **Submit a Review**
    - Click on the "Review" button in the sidebar.
    - Enter the item name, select a star rating, and add a review comment.
    - Click "Submit Review" to submit your review.

4. **Search for Items, Domains, and Reviews**
    - Click on the "Search" button in the sidebar.
    - Use the provided buttons to search for items, domains, user reviews, or item reviews in domains.

5. **Fetch Item Information**
    - Click on the "Item Info" button in the sidebar.
    - Enter the item name and click "Search" to fetch and display item information.

## Styles

The `styles.css` file contains styles for the entire application, including the layout, buttons, input fields, and sections. It ensures a consistent and responsive design for the user interface.

## Note

The project includes individual HTML files for testing each functionality in isolation. These files are located in the `Single` directory and can be used to test specific components independently.
