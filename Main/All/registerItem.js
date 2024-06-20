document.addEventListener('DOMContentLoaded', () => {
    // Get the container element and the relevant buttons and elements
    const container = document.getElementById('myAppContainer');
    const registerItemButton = container.querySelector('#registerItemButton');
    const submitRegisterItem = container.querySelector('#registerItem');
    const checkItemRegistration = container.querySelector('#checkItemRegistration');

    // Add event listener to the register item button to show the register item section
    registerItemButton.addEventListener('click', () => {
        showSection('registerItemSection');
    });

    // Function to register an item
    async function registerItem() {
        // Get the item name from the input field
        const itemName = container.querySelector('#itemNameRegister').value;
        console.log('Item Name:', itemName);

        // Prepare query parameters
        const queryParams = new URLSearchParams({
            itemName: itemName
        }).toString();

        try {
            // Send a POST request to register the item
            const response = await fetch(`http://84.55.60.45:443/registrations/register?${queryParams}`, {
                method: 'POST'
            });
            alert('Item successfully added to the registration queue!');
        } catch (error) {
            // Log any errors that occur during the item registration
            console.error("Error registering item:", error);
        }
    }

    // Function to check the registration status of an item
    async function checkRegistration() {
        // Get the item name from the input field
        const itemName = container.querySelector('#itemNameRegister').value;

        try {
            // Send a GET request to check the registration status of the item
            const response = await fetch(`http://84.55.60.45:443/registrations/items/${itemName}`, {
                method: 'GET'
            });
            const data = await response.json();

            // Display an alert based on the registration status
            if (data.success) {
                console.log(data.message);
                alert('Item is registered!');
            } else {
                alert('Item is not registered!');
            }
        } catch (error) {
            // Log any errors that occur while checking the registration status
            console.error("Error checking registration:", error);
        }
    }

    // Add event listeners to the submit and check buttons
    submitRegisterItem.addEventListener('click', registerItem);
    checkItemRegistration.addEventListener('click', checkRegistration);
});
