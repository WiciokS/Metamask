document.addEventListener('DOMContentLoaded', () => {
    // Get the container element and the item info button
    const container = document.getElementById('myAppContainer');
    const itemInfoButton = container.querySelector('#itemInfoButton');

    // Add event listener to the item info button to show the item info section
    itemInfoButton.addEventListener('click', () => {
        showSection('itemInfoSection');
    });

    // Function to search for item information
    async function itemInfoSearch(check) {
        // Clear any previous search results
        clearItemInfoResults();

        // Get the item name from the input field
        const itemName = container.querySelector('#ItemNameInfoSearch').value;
        console.log('Item Name:', itemName);

        try {
            // Fetch the item information from the server
            const response = await fetch(`http://84.55.60.45:443/items/${itemName}/info?useMapping=${check}`);
            const data = await response.json();

            // If the request is successful, display the item information
            if (data.success) {
                const itemInfo = data.message;
                console.log('Item Info Data:', itemInfo);

                displayItemInfo(itemInfo);
            } else {
                // Alert the user if there was an error fetching the item info
                alert('Error fetching item info.');
            }
        } catch (error) {
            // Log any errors that occur during the fetch
            console.error("Error fetching item info:", error);
        }
    }

    // Function to clear previous search results
    function clearItemInfoResults() {
        const itemInfoResults = container.querySelector('#itemInfoResults');
        itemInfoResults.innerHTML = '';
    }

    // Function to display the item information
    function displayItemInfo(itemInfo) {
        const itemInfoResults = container.querySelector('#itemInfoResults');
        const imagesHtml = itemInfo.Images.map(image =>
            `<img src="${image}" alt="${itemInfo['Item Name']}" style="max-width: 100%; height: auto; display: block; margin-bottom: 10px;" />`
        ).join('');
        itemInfoResults.innerHTML = `
            <h2>Item Name: ${itemInfo['Item Name']}</h2>
            <p>Alternate Name: ${itemInfo['Alternate Name']}</p>
            <p>Description: ${itemInfo['Description']}</p>
            <div>${imagesHtml}</div>
        `;
    }

    // Add event listeners to the search buttons with different parameters
    container.querySelector('#performItemInfoSearchButton').addEventListener('click', () => itemInfoSearch(true));
    container.querySelector('#performItemInfoSearchButton2').addEventListener('click', () => itemInfoSearch(false));
});
