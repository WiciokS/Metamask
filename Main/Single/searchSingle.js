document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const searchOptions = [
        { id: 'performSearchButton', label: 'Item', handler: itemSearch },
        { id: 'performDomainSearchButton', label: 'Domain', handler: domainSearch },
        { id: 'performUserSearchButton', label: 'User Reviews', handler: userSearch },
        { id: 'performItemInDomainSearchButton', label: 'Item in Domain', handler: itemInDomainSearch }
    ];

    // Load search options on page load
    loadSearchOptions();

    // Function to load search options dynamically
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

    // Function to clear search content
    function clearSearchContent() {
        const searchContent = container.querySelector('#searchContent');
        searchContent.innerHTML = '';
        const searchResults = container.querySelector('#searchResults');
        searchResults.innerHTML = '';
    }

    // Function to search for items
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

    // Function to search for domains
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

    // Function to search for user reviews
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

    // Function to search for items in a domain
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

    // Function to clear search results
    function clearResults() {
        const searchResults = container.querySelector('#searchResults');
        searchResults.innerHTML = '';
    }

    // Function to display item data
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

    // Function to display domain data
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
                <h2>Domain: ${decodeURIComponent(domains.name)}</h2>
            `;
        }
    }

    // Function to display reviews
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
