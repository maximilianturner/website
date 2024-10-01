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
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this);
    const articleData = [];

    for (let [key, value] of formData.entries()) {
        if (key === "textBlocks[]") {
            articleData.push(["text", value]); // Add text blocks to the array
        } else if (key === "mediaAssets[]") {
            articleData.push(["media", value.name]); // Add media file names to the array
        }
    }

    // Convert to JSON and log it
    const jsonOutput = JSON.stringify(articleData);
    console.log(jsonOutput); // Log the output

    // // Store a success message in localStorage
    // localStorage.setItem("submissionMessage", "Your article has been submitted successfully!");

    // Redirect to homepage
    window.location.href = "index.html"; // Modify to your homepage URL
});
