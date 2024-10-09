// Show the login modal when the "Login" button is clicked
document.getElementById('login-button').onclick = function() {
    document.getElementById('loginModal').style.display = 'block'; // Show the modal
};

// Close the modal when the 'X' button is clicked
document.getElementById('closeModal').onclick = function() {
    document.getElementById('loginModal').style.display = 'none'; // Hide the modal
    document.getElementById('error-message').innerText = ''; // Reset any error messages
};

// Handle password submission
document.getElementById('submit-password').onclick = function() {
    const password = document.getElementById('password').value;

    // Replace 'yourPassword' with the actual password you want to use
    const validPassword = "password"; 

    // Check if the entered password is correct
    if (password === validPassword) {
        // Redirect to the submission page on successful login
        window.location.href = 'submit.html'; // Update to the actual submission page URL
    } else {
        // If the password is incorrect, display an error message
        document.getElementById('error-message').innerText = 'Invalid password. Please try again.';
    }
};
