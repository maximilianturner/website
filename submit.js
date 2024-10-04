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

document.getElementById('article-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission and page refresh

    const formData = new FormData(this);
    const articleData = [];

    for (let [key, value] of formData.entries()) {
        if (key === "textBlocks[]") {
            articleData.push(["text", value]); // Add text blocks to the array
        } else if (key === "mediaAssets[]") {
            articleData.push(["media", value.name]); // Store media file names
        }
    }

    // Send the data to submit.php
    fetch('submit.php', {
        method: 'POST',
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Log the response from the server

        // Show the modal with a success message
        showModal("Your article has been submitted successfully!");

        // Do not redirect immediately, allow user interaction
    })
    .catch(error => console.error('Error submitting article:', error));
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
