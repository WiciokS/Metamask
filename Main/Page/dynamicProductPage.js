document.addEventListener('DOMContentLoaded', async () => {
    const container = document.createElement('div');
    container.id = 'myAppContainer';
    document.body.appendChild(container);

    // Get the product name from the script tag's data attribute
    const scriptTag = document.querySelector('script[data-itemname]');
    const itemName = scriptTag.getAttribute('data-itemname');

    // Function to generate the product info HTML (with dynamic average rating)
    async function generateProductInfo(reviewsContract) {
        const productInfoDiv = document.createElement('div');
        productInfoDiv.id = 'productInfo';

        const productNameElem = document.createElement('h1');
        productNameElem.id = 'productName';
        productNameElem.innerText = itemName || "Test Product Name";

        const productDescriptionElem = document.createElement('p');
        productDescriptionElem.id = 'productDescription';
        productDescriptionElem.innerText = "This is a placeholder description for the product.";

        // Fetch the reviews and calculate the average rating
        const domainName = window.location.hostname;
        const reviews = await fetchReviews(reviewsContract, itemName, domainName);

        const averageRating = calculateAverageRating(reviews);

        // Generate stars for the average rating
        const averageRatingStars = generateSvgStars(averageRating);
        const productRatingElem = document.createElement('p');
        productRatingElem.id = 'productRating';
        productRatingElem.innerHTML = `<div class="svg-star-container">${averageRatingStars}</div>`;

        productInfoDiv.appendChild(productNameElem);
        productInfoDiv.appendChild(productDescriptionElem);
        productInfoDiv.appendChild(productRatingElem);

        // Insert the product info section at the top of the container
        const firstChild = container.firstChild;
        container.insertBefore(productInfoDiv, firstChild); // Add it before anything else
    }

// Function to calculate the average rating from reviews
    function calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0; // If no reviews, return 0

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    }

    // Function to generate MetaMask section
    function generateMetaMaskSection() {
        const metaMaskDiv = document.createElement('div');
        metaMaskDiv.id = 'metaMaskSection';

        const metaMaskButton = document.createElement('button');
        metaMaskButton.id = 'metaMaskLoginButton';
        metaMaskButton.innerText = 'Connect to MetaMask';

        metaMaskDiv.appendChild(metaMaskButton);
        const commentsListDiv = document.getElementById('commentsList');
        container.insertBefore(metaMaskDiv, commentsListDiv);

        metaMaskButton.addEventListener('click', async () => {
            const metaMaskData = await connectToMetaMask();
            if (metaMaskData) {
                document.getElementById('metaMaskSection').style.display = 'none';
                const userHasCommented = await checkIfUserHasCommented(metaMaskData.reviewsContract);
                if (!userHasCommented) {
                    generateCommentSection(metaMaskData.reviewsContract);
                } else {
                    console.log("User has already left a comment, hiding comment box.");
                }
                displayReviews(metaMaskData.reviewsContract);
            }
        });
    }

// Function to generate the comment section with star rating and loading spinner
    function generateCommentSection(reviewsContract) {
        const commentSectionDiv = document.createElement('div');
        commentSectionDiv.id = 'commentSection';
        commentSectionDiv.classList.add('myApp-comment-card'); // Add the card style

        const commentBox = document.createElement('textarea');
        commentBox.id = 'commentBox';
        commentBox.placeholder = 'Write a comment';

        // Create star rating elements
        const starRatingDiv = document.createElement('div');
        starRatingDiv.classList.add('star-rating');

        const ratingValue = document.createElement('span');
        ratingValue.id = 'ratingValue';
        ratingValue.innerText = '0/5';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.innerHTML = '&#9734;';
            star.dataset.value = i;

            // Add event listener to handle star selection
            star.addEventListener('click', () => {
                ratingValue.innerText = `${i}/5`;
                const allStars = starRatingDiv.querySelectorAll('.star');
                allStars.forEach((s, index) => {
                    if (index < i) {
                        s.classList.add('selected');
                        s.innerHTML = '&#9733;'; // Filled star
                    } else {
                        s.classList.remove('selected');
                        s.innerHTML = '&#9734;'; // Empty star
                    }
                });
            });

            starRatingDiv.appendChild(star);
        }
        starRatingDiv.appendChild(ratingValue);

        const submitCommentButton = document.createElement('button');
        submitCommentButton.id = 'submitCommentButton';
        submitCommentButton.innerText = 'Submit Comment';

        // Append all elements to the comment section
        commentSectionDiv.appendChild(starRatingDiv);
        commentSectionDiv.appendChild(commentBox);
        commentSectionDiv.appendChild(submitCommentButton);

        // Insert the comment section before the comments list
        const commentsListDiv = document.getElementById('commentsList');
        container.insertBefore(commentSectionDiv, commentsListDiv);

        // Create the loading spinner (initially hidden)
        const loadingSpinner = document.createElement('div');
        loadingSpinner.classList.add('loading-spinner');
        loadingSpinner.style.display = 'none'; // Hidden initially
        commentSectionDiv.appendChild(loadingSpinner);

        // Event listener for submitting the comment
        submitCommentButton.addEventListener('click', async () => {
            const comment = commentBox.value;
            const rating = parseInt(ratingValue.innerText);
            const domainName = window.location.hostname; // Domain name of the website
            const currentItemName = itemName; // Product name passed from HTML

            if (!comment || rating === 0) {
                alert('Please provide a comment and select a rating.');
                return;
            }

            try {
                // Hide stars, comment box, and submit button
                starRatingDiv.style.display = 'none';
                commentBox.style.display = 'none';
                submitCommentButton.style.display = 'none';

                // Show the loading spinner
                loadingSpinner.style.display = 'block';

                // Submit the review
                await addReview(reviewsContract, domainName, currentItemName, comment, rating);

                // Hide the comment box after submitting (the whole section is hidden)
                commentSectionDiv.style.display = 'none';

                // Refresh the reviews to show the new comment
                displayReviews(reviewsContract);
            } catch (error) {
                console.error('Error adding review:', error);

                // Handle rejection or error by showing the comment box again
                alert('Transaction failed or was rejected. Please try again.');

                // Show stars, comment box, and submit button again
                starRatingDiv.style.display = 'block';
                commentBox.style.display = 'block';
                submitCommentButton.style.display = 'block';

                // Hide the loading spinner
                loadingSpinner.style.display = 'none';
            }
        });
    }





// Function to check if the user has already left a comment
    async function checkIfUserHasCommented(reviewsContract) {
        const domainName = window.location.hostname;
        const { signer } = await connectToMetaMask();
        const userAddress = await signer.getAddress();

        // Fetch reviews filtered by item name and domain name
        const reviews = await fetchReviews(reviewsContract, itemName, domainName);

        // Check if the user has left a review
        const userReview = reviews.find(review => review.reviewer.toLowerCase() === userAddress.toLowerCase());
        return !!userReview; // Return true if user has left a review
    }


    // Function to generate comments list with a scrollable container
    function generateCommentsList() {
        const commentsListDiv = document.createElement('div');
        commentsListDiv.id = 'commentsList';

        const commentsHeader = document.createElement('h2');
        commentsHeader.innerText = 'Comments';

        const commentsContainer = document.createElement('div');
        commentsContainer.id = 'commentsContainer';
        commentsContainer.classList.add('myApp-scrollable-comments'); // Add a class for scrolling

        commentsListDiv.appendChild(commentsHeader);
        commentsListDiv.appendChild(commentsContainer);
        container.appendChild(commentsListDiv);
    }

// Function to fetch and display reviews inside the scrollable container
    async function displayReviews(reviewsContract) {
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = ''; // Clear existing comments

        const domainName = window.location.hostname;
        const { signer } = await connectToMetaMask();
        const userAddress = await signer.getAddress();

        // Fetch reviews filtered by item name and domain name
        const reviews = await fetchReviews(reviewsContract, itemName, domainName);

        // Separate the logged-in user's review from the rest
        let userReview = null;
        const otherReviews = [];

        reviews.forEach((review) => {
            if (review.reviewer.toLowerCase() === userAddress.toLowerCase()) {
                userReview = review; // Store the logged-in user's review
            } else {
                otherReviews.push(review); // Store other users' reviews
            }
        });

        // Display user's review first if available
        if (userReview) {
            const userReviewDiv = createReviewCard(userReview, true);
            commentsContainer.appendChild(userReviewDiv);
        }

        // Display other reviews
        otherReviews.forEach((review) => {
            const reviewDiv = createReviewCard(review, false);
            commentsContainer.appendChild(reviewDiv);
        });
    }

// Helper function to create a review card with stars for the rating
    function createReviewCard(review, isUserReview) {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('myApp-review-card'); // Generic class for review card

        if (isUserReview) {
            reviewDiv.classList.add('myApp-user-review'); // Special styling for the logged-in user's review
        }

        // Generate stars based on rating
        const stars = generateSvgStars(review.rating);

        reviewDiv.innerHTML = `
        <div class="myApp-review-header">
            <strong>${isUserReview ? 'You' : review.reviewer}</strong>
        </div>
        <div class="myApp-review-body">
            <p class="myApp-review-stars">${stars}</p>
            <p class="myApp-review-comment">${review.comment}</p>
        </div>
    `;

        return reviewDiv;
    }



// Function to generate stars for a given rating (without the number and with tighter spacing for partial stars)
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += `<span class="star full">&#9733;</span>`; // Full star
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                // Calculate partial star width based on the decimal part of the rating
                const filledWidth = (rating % 1) * 100;
                stars += `
                <span class="star partial" style="--filled-width: ${filledWidth}%;">
                    &#9733;
                </span>
            `;
            } else {
                stars += `<span class="star">&#9734;</span>`; // Empty star
            }
        }
        return stars;
    }

    // Function to generate SVG stars with partial star correctly filled with grey
    function generateSvgStars(rating) {
        let stars = '';
        const fullStarSvg = `
        <svg viewBox="0 0 24 24" width="100%" height="100%">
            <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9"/>
        </svg>`;

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                // Full star
                stars += `<span class="svg-star full">${fullStarSvg}</span>`;
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                // Partial star with both filled and empty portions
                const filledWidth = (rating % 1) * 100;
                stars += `
                <span class="svg-star partial">
                    <svg viewBox="0 0 24 24" width="100%" height="100%">
                        <!-- Empty part of the star -->
                        <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" fill="#ddd"/>
                        <!-- Filled part of the star -->
                        <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" class="partial-fill" style="clip-path: inset(0 ${100 - filledWidth}% 0 0);" fill="#f76b1c"/>
                    </svg>
                </span>`;
            } else {
                // Empty star
                stars += `<span class="svg-star empty">${fullStarSvg}</span>`;
            }
        }
        return stars;
    }


    // Function to print contract addresses
    async function printContractAddresses(reviewsContract) {
        try {
            const domainContainerAddress = await reviewsContract.getDomainContainer();
            const itemContainerAddress = await reviewsContract.getItemContainer();
            const userContainerAddress = await reviewsContract.getUserContainer();

            // Print the addresses to the console
            console.log('DomainContainer Address:', domainContainerAddress);
            console.log('ItemContainer Address:', itemContainerAddress);
            console.log('UserContainer Address:', userContainerAddress);
        } catch (error) {
            console.error('Error fetching contract addresses:', error);
        }
    }

    // Initialize the page (make sure to pass reviewsContract when generating product info)
    async function init() {
        const metaMaskData = await connectToMetaMask();
        if (metaMaskData) {
            generateProductInfo(metaMaskData.reviewsContract); // Generate product info with rating
            generateCommentsList();
            displayReviews(metaMaskData.reviewsContract);
            generateMetaMaskSection();
        }
    }

    // Initialize the page
    init();
});
