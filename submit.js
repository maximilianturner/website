let textBlockCount = 0;
let mediaBlockCount = 0;

function addContent() {
    const contentType = document.getElementById('content-type').value; 
    const contentContainer = document.getElementById('content-container');

    let contentBlock;

    if (contentType === "text") {
        textBlockCount++;
        contentBlock = document.createElement('div');
        contentBlock.className = 'content-block';
        contentBlock.innerHTML = `
            <label for="text${textBlockCount}">Text Block:</label>
            <textarea id="text${textBlockCount}" name="textBlocks[]" rows="4" cols="50" required></textarea>
            <button type="button" class="remove-btn" onclick="removeBlock(this)">Remove</button>
        `;
    } else if (contentType === "media") {
        mediaBlockCount++;
        contentBlock = document.createElement('div');
        contentBlock.className = 'content-block';
        contentBlock.innerHTML = `
            <label for="media${mediaBlockCount}">Media Asset:</label>
            <input type="file" id="media${mediaBlockCount}" name="mediaAssets[]" required>
            <button type="button" class="remove-btn" onclick="removeBlock(this)">Remove</button>
        `;
    }

    // Append the newly created content block to the container
    contentContainer.appendChild(contentBlock);
}

function removeBlock(btn) {
    btn.parentElement.remove(); // Remove the respective block
}

// Function to go back to index.html
function goBack() {
    window.location.href = 'index.html';
}

let isSubmitting = false; // Flag to control submission

document.getElementById('article-form').addEventListener('submit', function (event) {
    event.preventDefault();
    if (isSubmitting) return; // Prevent further submissions
    isSubmitting = true; // Set flag to indicate submission in progress
    const formData = new FormData(this);
    // Gather form data here
    fetch('submit.php', {
        method: 'POST',
        body: formData // No need to stringify, FormData handles it
    })
    .then(response => {
        return response.json(); // Parse JSON response
    })
    .then(data => {
        // Handle success or error messages here
        if (data.success) {
            showModal("Your article has been submitted successfully!");
        } else {
            showModal(data.error || "An error occurred while submitting your article.");
        }
        isSubmitting = false; // Reset the flag
    })
    .catch(error => {
        console.error('Error submitting article:', error);
        isSubmitting = false; // Reset flag on error
    });
});

// Function to show the modal
function showModal(message) {
    document.getElementById('modalMessage').innerText = message; // Set the message
    document.getElementById('submissionModal').style.display = 'block'; // Show the modal
}

// Close the modal
document.getElementById('closeModal').onclick = function() {
    document.getElementById('submissionModal').style.display = 'none'; // Hide the modal
    window.location.href = "index.html"; // Redirect after closing
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById('submissionModal')) {
        document.getElementById('submissionModal').style.display = 'none'; // Hide the modal
        window.location.href = "index.html"; // Redirect after closing
    }
}
