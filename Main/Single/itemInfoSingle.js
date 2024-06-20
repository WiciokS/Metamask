document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');

    // Function to search for item information
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

    // Function to clear item info results
    function clearItemInfoResults() {
        const itemInfoResults = container.querySelector('#itemInfoResults');
        itemInfoResults.innerHTML = '';
    }

    // Function to display item info
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
