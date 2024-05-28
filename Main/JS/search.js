document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const performSearchButton = document.getElementById('performSearchButton');
    const searchSection = document.getElementById('searchSection');

    searchButton.addEventListener('click', () => {
        showSection('searchSection');
    });

    performSearchButton.addEventListener('click', itemSearch);

    async function itemSearch() {
        const itemName = document.getElementById('ItemNameSearch').value;

        const queryParams = new URLSearchParams({
            itemName: itemName
        }).toString();

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

    function displayItemData(item) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = `
            <h2>Item: ${item.name}</h2>
            <p>Average Rating: ${item.rating}</p>
            <p>Available on Domains: ${item.availableOnDomainNames.join(', ')}</p>
        `;
    }

    function displayReviews(reviews) {
        const searchResults = document.getElementById('searchResults');
        const reviewsHtml = reviews.map(review => `
            <div class="review">
                <p><strong>Reviewer:</strong> ${review.reviewer}</p>
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
