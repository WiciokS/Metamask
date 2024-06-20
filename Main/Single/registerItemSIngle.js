document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('myAppContainer');
    const submitRegisterItem = container.querySelector('#registerItem');
    const checkItemRegistration = container.querySelector('#checkItemRegistration');

    // Function to register an item
    async function registerItem() {
        const itemName = container.querySelector('#itemNameRegister').value;
        console.log('Item Name:', itemName);

        const queryParams = new URLSearchParams({
            itemName: itemName
        }).toString();

        try {
            const response = await fetch(`http://84.55.60.45:443/registrations/register?${queryParams}`, {
                method: 'POST'
            });
            alert('Item successfully added to the registration queue!')
        } catch (error) {
            console.error("Error registering item:", error);
        }
    }

    // Function to check if an item is registered
    async function checkRegistration() {
        const itemName = container.querySelector('#itemNameRegister').value;

        try {
            const response = await fetch(`http://84.55.60.45:443/registrations/items/${itemName}` , {
                method: 'GET'
            });
            const data = await response.json();

            if (data.success) {
                console.log(data.message);
                alert('Item is registered!');
            } else {
                alert('Item is not registered!');
            }

        } catch (error) {
            console.error("Error checking registration:", error);
        }
    }

    submitRegisterItem.addEventListener('click', registerItem);
    checkItemRegistration.addEventListener('click', checkRegistration);
});
