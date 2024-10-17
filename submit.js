let contentList = [];

function addContent() {
    const contentType = document.getElementById('content-type').value; 
    const contentContainer = document.getElementById('content-container');

    let contentElement, contentData;

    if (contentType === "text") {
        const textArea = document.createElement('textarea');
        textArea.placeholder = 'Enter text here';
        contentElement = document.createElement('div');
        contentElement.appendChild(textArea);
        contentData = { type: 'text', content: textArea.value };

        textArea.oninput = () => {
            contentData.content = textArea.value; // Update content data on input
        };
        
    } else if (contentType === "media") {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        contentElement = document.createElement('div');
        contentElement.appendChild(fileInput);
        contentData = { type: 'media', content: fileInput };

        fileInput.onchange = () => {
            contentData.content = fileInput.files[0]; // Store the file
        };
    }

    contentContainer.appendChild(contentElement);
    contentList.push(contentData); // Maintain order

    contentElement.className = 'content-block';
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
        contentContainer.removeChild(contentElement);
        contentList = contentList.filter(c => c !== contentData); // Remove from list
    };
    contentElement.appendChild(removeBtn);
}

function removeBlock(btn) {
    btn.parentElement.remove(); // Remove the respective block
}

// Function to go back to index.html
function goBack() {
    window.location.href = 'index.html';
}

let isSubmitting = false; // Flag to control submission

document.getElementById('article-form').addEventListener('submit', function(event) {
    event.preventDefault();

    if (isSubmitting) return; // Prevent further submissions
    isSubmitting = true; // Set flag to indicate submission in progress

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    
    contentList.forEach((content, index) => {
        if (content.type === 'text') {
            formData.append(`content[${index}][type]`, 'text');
            formData.append(`content[${index}][value]`, content.content);
        } else if (content.type === 'media' && content.content instanceof File) {
            formData.append(`content[${index}][type]`, 'media');
            formData.append(`content[${index}][file]`, content.content);
        }
    });

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
