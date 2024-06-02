document.addEventListener('DOMContentLoaded', () => {
    const itemInfoButton = document.getElementById('itemInfoButton');
    const performItemInfoSearchButton = document.getElementById('performItemInfoSearchButton');
    const itemInfoSection = document.getElementById('itemInfoSection');

    itemInfoButton.addEventListener('click', () => {
        showSection('itemInfoSection');
    });

    performItemInfoSearchButton.addEventListener('click', itemInfoSearch);

    async function itemInfoSearch() {
        clearItemInfoResults();
        const itemName = document.getElementById('ItemNameInfoSearch').value;

        try {
            const response = await fetch(`http://84.55.60.45:443/items/${itemName}/info`);
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
        const itemInfoResults = document.getElementById('itemInfoResults');
        itemInfoResults.innerHTML = '';
    }

    function displayItemInfo(itemInfo) {
        const itemInfoResults = document.getElementById('itemInfoResults');
        const imagesHtml = itemInfo.Images.map(image => `<img src="${image}" alt="${itemInfo['Item Name']}" style="max-width: 100%; height: auto; display: block; margin-bottom: 10px;" />`).join('');
        itemInfoResults.innerHTML = `
            <h2>Item Name: ${itemInfo['Item Name']}</h2>
            <p>Alternate Name: ${itemInfo['Alternate Name']}</p>
            <p>Description: ${itemInfo['Description']}</p>
            <div>${imagesHtml}</div>
        `;
    }
});
