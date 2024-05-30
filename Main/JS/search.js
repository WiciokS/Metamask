document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const performSearchButton = document.getElementById('performSearchButton');
    const performDomainSearchButton = document.getElementById('performDomainSearchButton');
    const performUserSearchButton = document.getElementById('performUserSearchButton');
    const performItemInDomainSearchButton = document.getElementById('performItemInDomainSearchButton');
    const searchSection = document.getElementById('searchSection');

    searchButton.addEventListener('click', () => {
        showSection('searchSection');
    });

    performSearchButton.addEventListener('click', itemSearch);
    performDomainSearchButton.addEventListener('click', domainSearch);
    performUserSearchButton.addEventListener('click', userSearch);
    performItemInDomainSearchButton.addEventListener('click', itemInDomainSearch);

    async function itemSearch() {
        clearResults();
        const itemName = document.getElementById('ItemNameSearch').value;
        console.log('Item Name:', itemName);
        const queryParams = new URLSearchParams({
            itemName: itemName
        }).toString();
        console.log('Query Params:', queryParams);
        try {
            const itemResponse = await fetch(`http://84.55.60.45:443/getItem?${queryParams}`);
            const itemData = await itemResponse.json();

            if (itemData.success) {
                const item = itemData.message;
                console.log('Item Data:', item);

                displayItemData(item);

                const reviewsResponse = await fetch(`http://84.55.60.45:443/getReviewsForItem?${queryParams}`);
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
    }

    async function domainSearch() {
        clearResults();
        const domainName = document.getElementById('DomainNameSearch').value;
        console.log('Domain Name:', domainName);
        const queryParams = new URLSearchParams({
            domainName: domainName
        }).toString();
        console.log('Query Params:', queryParams);
        try {
            const domainResponse = await fetch(`http://84.55.60.45:443/getDomain?${queryParams}`);
            const domainData = await domainResponse.json();

            if (domainData.success) {
                const domain = domainData.message;
                console.log('Domain Data:', domain);

                displayDomainData(domain);

                const reviewsResponse = await fetch(`http://84.55.60.45:443/getReviewsForDomain?${queryParams}`);
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
    }

    async function userSearch() {
        clearResults();
        const userAddress = document.getElementById('UserAddressSearch').value;
        console.log('User Address:', userAddress);
        const queryParams = new URLSearchParams({
            address: userAddress
        }).toString();
        console.log('Query Params:', queryParams);
        try {
            const userResponse = await fetch(`http://84.55.60.45:443/getReviewsOfUser?${queryParams}`);
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
    }

    async function itemInDomainSearch() {
        clearResults();
        const itemName = document.getElementById('ItemNameInDomainSearch').value;
        const domainName = document.getElementById('DomainNameForItemSearch').value;
        console.log('Item Name:', itemName);
        console.log('Domain Name:', domainName);
        const queryParams = new URLSearchParams({
            itemName: itemName,
            domainName: domainName
        }).toString();
        console.log('Query Params:', queryParams);
        try {
            const reviewsResponse = await fetch(`http://84.55.60.45:443/getReviewsForItemOfDomain?${queryParams}`);
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
    }

    function clearResults() {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
    }

    function displayItemData(item) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = `
            <h2>Item: ${item.name}</h2>
            <p>Average Rating: ${item.rating}</p>
            <p>Available on Domains: ${item.availableOnDomainNames.join(', ')}</p>
        `;
    }

    function displayDomainData(domain) {
        const decodedDomainName = decodeURIComponent(domain.name);
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = `
            <h2>Domain: ${decodedDomainName}</h2>
        `;
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
