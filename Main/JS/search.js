document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchOptions = [
        { id: 'performSearchButton', label: 'Search Item', handler: itemSearch },
        { id: 'performDomainSearchButton', label: 'Search Domain', handler: domainSearch },
        { id: 'performUserSearchButton', label: 'Search User Reviews', handler: userSearch },
        { id: 'performItemInDomainSearchButton', label: 'Search Item in Domain', handler: itemInDomainSearch }
    ];

    searchButton.addEventListener('click', () => {
        showSection('dynamicSection');
        loadSearchOptions();
    });

    function loadSearchOptions() {
        const dynamicSection = document.getElementById('dynamicSection');
        dynamicSection.innerHTML = `
            <div class="search-options">
                ${searchOptions.map(option => `<button id="${option.id}">${option.label}</button>`).join('')}
            </div>
            <div id="searchContent" class="search-content"></div>
            <div id="searchResults"></div>
        `;

        searchOptions.forEach(option => {
            document.getElementById(option.id).addEventListener('click', () => {
                clearSearchContent();
                option.handler();
            });
        });
    }

    function clearSearchContent() {
        const searchContent = document.getElementById('searchContent');
        searchContent.innerHTML = '';
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
    }

    async function itemSearch() {
        const searchContent = document.getElementById('searchContent');
        searchContent.innerHTML = `
            <input type="text" id="ItemNameSearch" placeholder="Enter item name">
            <button id="performItemSearch">Search Item</button>
        `;
        document.getElementById('performItemSearch').addEventListener('click', async () => {
            clearResults();
            const itemName = document.getElementById('ItemNameSearch').value;
            console.log('Item Name:', itemName);

            try {
                const itemResponse = await fetch(`http://84.55.60.45:443/items/${itemName}`);
                const itemData = await itemResponse.json();

                if (itemData.success) {
                    const item = itemData.message;
                    console.log('Item Data:', item);

                    displayItemData(item);

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
        const searchContent = document.getElementById('searchContent');
        searchContent.innerHTML = `
            <input type="text" id="DomainNameSearch" placeholder="Enter domain name">
            <button id="performDomainSearch">Search Domain</button>
        `;
        document.getElementById('performDomainSearch').addEventListener('click', async () => {
            clearResults();
            const domainName = document.getElementById('DomainNameSearch').value;
            console.log('Domain Name:', domainName);

            try {
                const domainResponse = await fetch(`http://84.55.60.45:443/domains/${domainName}`);
                const domainData = await domainResponse.json();

                if (domainData.success) {
                    const domain = domainData.message;
                    console.log('Domain Data:', domain);

                    displayDomainData(domain);

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
        const searchContent = document.getElementById('searchContent');
        searchContent.innerHTML = `
            <input type="text" id="UserAddressSearch" placeholder="Enter user address">
            <button id="performUserSearch">Search User Reviews</button>
        `;
        document.getElementById('performUserSearch').addEventListener('click', async () => {
            clearResults();
            const userAddress = document.getElementById('UserAddressSearch').value;
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
        const searchContent = document.getElementById('searchContent');
        searchContent.innerHTML = `
            <input type="text" id="ItemNameInDomainSearch" placeholder="Enter item name in domain">
            <input type="text" id="DomainNameForItemSearch" placeholder="Enter domain name for item">
            <button id="performItemInDomainSearch">Search Item in Domain</button>
        `;
        document.getElementById('performItemInDomainSearch').addEventListener('click', async () => {
            clearResults();
            const itemName = document.getElementById('ItemNameInDomainSearch').value;
            const domainName = document.getElementById('DomainNameForItemSearch').value;
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
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
    }

    function displayItemData(items) {
        const searchResults = document.getElementById('searchResults');
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
        const searchResults = document.getElementById('searchResults');
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

    function displayReviews(reviews) {
        const searchResults = document.getElementById('searchResults');
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
