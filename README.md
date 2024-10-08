
# MetaMask Integration Project

## Overview

This project integrates MetaMask functionalities with a web interface, allowing users to interact with blockchain-based services such as logging in, submitting reviews, registering items, searching for items and domains, and fetching item information. The project is divided into several components, each handling a specific functionality.

## Project Structure(NEW Part)

### Page Directory
- `contractInteraction.js`: Handles interactions with the smart contract, including registering items, submitting reviews, and fetching item information.
- `dynamicProductInfo.js`: Manages the dynamic display of product information based on user input.
- `page.html`: Main HTML file that includes sections for MetaMask login, product reviews, and dynamic product information.
- `styles.css`: Contains styles for the entire application.

### Key Features:
1. **Dynamic Product Display**:
   - The product name and details are dynamically displayed based on the product identifier passed through the HTML `<script>` tag.
   - Average product ratings are calculated based on existing reviews and displayed as stars.

2. **MetaMask Integration**:
   - Users are required to connect their MetaMask wallet to interact with the review system.
   - The connection process is triggered after the page load or the user clicks the "Connect to MetaMask" button.
   - Upon connection, the MetaMask button disappears, and the user’s review options are displayed.

3. **Review Submission**:
   - Once connected, users can submit reviews for the product, including a star rating and a written comment.
   - Reviews are stored on a blockchain, and the submission includes blockchain interaction via smart contracts.
   - After submission, the review list is updated dynamically.

4. **Review Display**:
   - Users can view a scrollable list of all reviews for the product.
   - If a user has already submitted a review, their review is highlighted and shown at the top of the list.
   - The rating system uses stars, with partial star rendering for ratings like 4.5.

5. **Loading and Error Handling**:
   - A loading spinner is displayed when submitting a review.
   - If the transaction is rejected or fails, the form is redisplayed with an error message, allowing the user to try again.

### Usage:
- The main functionality is encapsulated in the `dynamicProductPage.js` and `contractInteraction.js` files.
- Ensure the MetaMask extension is installed in the browser for blockchain interaction.
- The `page.html` file provides the HTML structure, which includes the product name passed via a `<script>` tag.

### Example Usage:
- `<script src="dynamicProductPage.js" data-itemname="YourProductName"></script>`
--------------------------------------------

## Project Structure(OLD Part)

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
This updated `README.md` includes all the necessary details for the new page part. It explains how the MetaMask connection, product reviews, and dynamic product information are handled in the project.
