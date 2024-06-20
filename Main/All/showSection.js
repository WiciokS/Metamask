function showSection(sectionId) {
    // Get the container element
    const container = document.getElementById('myAppContainer');

    // Get all elements with the class 'section' within the container
    const sections = container.querySelectorAll('.section');

    // Loop through each section element
    sections.forEach(section => {
        // Check if the section's ID matches the provided sectionId
        if (section.id === sectionId) {
            // If it matches, add the 'active' class and remove the 'hidden' class
            section.classList.add('active');
            section.classList.remove('hidden');
        } else {
            // If it doesn't match, remove the 'active' class and add the 'hidden' class
            section.classList.remove('active');
            section.classList.add('hidden');
        }
    });
}
