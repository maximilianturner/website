const tags = ["music","sports","intrigue","art","weather","power","gossip"];
console.log(tags)
let tallyCount = 0; // Initialize tally count

function loadArticles(data) {
    const container = document.getElementById('article-container');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<p>No articles found.</p>';
        return;
    }

    data.forEach((article, i) => {
		const articleGroup = document.createElement('div');
		articleGroup.className = 'article-group';
		
        const articleTitleLink = document.createElement('a');
        articleTitleLink.href = `article.html?timestamp=` + article.timestamp; // Link to the article page
        articleTitleLink.className = 'article-title'; // Add the class to apply styles
		articleTitleLink.textContent = article.title;
		
        // Append title link to the article group
        articleGroup.appendChild(articleTitleLink);
		
        if (i === 0) {
            const articleContent = document.createElement('p');
            articleContent.className = 'article-content';
            articleContent.textContent = article.content;
            articleGroup.appendChild(articleContent);
        } else {
            articleGroup.appendChild(articleTitleLink);
        }
		
        container.appendChild(articleGroup);
    });
}

function loadJsonp(url) {
    const script = document.createElement('script');
    script.src = url;
    script.onerror = () => console.error('Error loading script:', url);
    document.head.appendChild(script);
}

function filterByTag(tag) {
    alert(`Filtering articles by tag: ${tag}`);
    // Logic to filter articles
}

function initTags() {
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.innerHTML = ''; // Clear any existing tags

    const tagElements = tags.map(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.onclick = () => filterByTag(tag);
        return tagElement;
    });

    tagElements.forEach((tagElement, index) => {
        tagsContainer.appendChild(tagElement);
    });
}


function addTallyMark(tallyCount) {
    const tallyContainer = document.getElementById('tally-container');

    const tallyLink = document.createElement('a'); // Create an anchor tag
    tallyLink.className = 'tally-link'; // Add a class for styling or JavaScript targeting
    tallyLink.href = `article.html?timestamp=09242024230237`;
    
    // Create a tally mark
    const tallyMark = document.createElement('div');
    tallyMark.className = 'tally-mark';
    tallyLink.appendChild(tallyMark); // Append the tally mark to the link
    tallyContainer.appendChild(tallyLink); // Append the link to the tally container
    
    // Add a blank space after the first 5 tally marks
    if (tallyCount % 5 === 0 && tallyCount > 0) { // After the 5th tally mark
        const blankSpace = document.createElement('div');
        blankSpace.className = 'blank-space'; // Class for styling
        tallyContainer.appendChild(blankSpace);
        if (tallyCount % 10 === 0) {
            const rowBreak = document.createElement('div');
            rowBreak.className = 'tally-row'; // Class for styling
            tallyContainer.appendChild(rowBreak);
        }
    }
    const header = document.getElementById('header');
    header.textContent = `Day ${tallyCount}`; // Set header to the static count value
}

document.addEventListener('DOMContentLoaded', () => {
    initTags();
    for (let i = 0; i < 999; i++) {
        addTallyMark(i+1);
    }    
});

const scriptUrl = 'https://script.google.com/macros/s/AKfycbwEDXlCUE759nSrM-CXwvpPY44T1dr9AB3H09GjF6plK8s9lBX14O4WZJu-rppo69yS/exec?callback=loadArticles';
loadJsonp(scriptUrl);