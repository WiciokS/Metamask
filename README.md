
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
