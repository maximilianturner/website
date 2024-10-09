const tags = ["music","sports","intrigue","art","weather","power","gossip"];
console.log(tags)
let tallyCount = 0; // Initialize tally count

function loadArticles(data) {
    const container = document.getElementById('article-container');
    container.innerHTML = ''; // Clear the container

    if (!data || data.length === 0) {
        container.innerHTML = '<p>No articles found.</p>';
        return;
    }

    data.forEach((article, i) => {
        const articleGroup = document.createElement('div');
        articleGroup.className = 'article-group';
        
        const articleTitleLink = document.createElement('a');
        articleTitleLink.href = '#'; // Prevents changing the page
        articleTitleLink.className = 'article-title';
        articleTitleLink.textContent = article.title;

        const articleContent = document.createElement('p');
        articleContent.className = 'article-content';
        articleContent.textContent = article.content;

        // Initially show the content only for the first article
        if (i === 0) {
            articleContent.style.display = 'block'; // Show the first article's content
        } else {
            articleContent.style.display = 'none'; // Hide subsequent articles' content
        }

        // Toggle visibility of the article content on title click
        articleTitleLink.onclick = (event) => {
            event.preventDefault(); // Prevents default anchor behavior
            const isVisible = articleContent.style.display === 'block';
            articleContent.style.display = isVisible ? 'none' : 'block'; // Toggle visibility
        };

        // Append title link and content to the article group
        articleGroup.appendChild(articleTitleLink);
        articleGroup.appendChild(articleContent);
        
        container.appendChild(articleGroup);
    });
}

function loadJsonp(url) {
    const script = document.createElement('script');
    script.src = url;
    script.onerror = () => console.error('Error loading script:', url);
    document.head.appendChild(script);
}

function fetchArticles() {
    fetch('articles.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // console.log(response)
            return response.json(); // Parse JSON response
        })
        .then(data => {
            console.log(data)
            loadArticles(data); // Pass the data directly to loadArticles
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            const container = document.getElementById('article-container');
            container.innerHTML = '<p>Error loading articles.</p>'; // Display error message
        });
}




const tagTree = {
	author: ['Woodby Hasbin', 'Sadie Efsler', 'Shotaffa Cup'],
	topic: ['music', 'sports', 'power', 'art', 'weather', 'gossip'],
	date: {
		year: Array.from({ length: 5 }, (_, i) => i + 2020),
		month: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
		day: Array.from({ length: 31 }, (_, i) => i + 1)
	}
};
console.log(tagTree)

const selectedTags = new Set();

function growTagTreeDivs(tree, branch, recurses, path = '') {
	const currDepth = recurses;
	
	const leafSymb = '&#9500;';
	const branchPlusSymb = '+'; //'&#11570;'; circled plus
	const branchMinusSymb = '-'; //'&#11569;'; circled minus
	const passingSymb = '&#9482;';
	const spacing = '&nbsp;'

	for (const key in tree) {
		const value = tree[key];

		const branchContainer = document.createElement('div');
		branchContainer.className = 'tag-branch';
		branchContainer.id = `${key}-branch`;

		// Create prefix and label for the branch
		const branchPrefix = document.createElement('span');
		branchPrefix.className = 'tree-prefix';
		branchPrefix.innerHTML = passingSymb.repeat(currDepth) + branchPlusSymb + spacing;

		const branchLabel = document.createElement('span');
		branchLabel.className = 'tree-label';
		branchLabel.innerHTML = key;

		// Append prefix and label to the branch div
		branchContainer.appendChild(branchPrefix);
		branchContainer.appendChild(branchLabel);

		// Update the path for the current branch
		const newPath = path ? `${path}-${key}` : key; // Build the path for ID

		// Create a container for children (leaves and nested branches)
		const branchChildren = document.createElement('div');
		branchChildren.className = 'tag-children';
		branchChildren.style.display = 'none'; // Start collapsed

		if (Array.isArray(value)) {
			// If the value is an array, create leaves
			value.forEach(tag => {
				const leaf = document.createElement('div');
				leaf.className = 'tag-leaf';
				leaf.id = `tag-${newPath}-${tag}`;
				
				const tagPrefix = document.createElement('span');
				tagPrefix.className = 'tree-prefix';
				tagPrefix.innerHTML = passingSymb.repeat(currDepth + 1) + leafSymb + spacing;
				
				const tagLabel = document.createElement('span');
				tagLabel.className = 'tree-label';
				tagLabel.innerHTML = tag;
				
				// toggle filter leaves on and off
				tagLabel.addEventListener('click', function(event) {
					event.stopPropagation();
					const exactTag = `${newPath}-${tag}`;
					if (tagLabel.style.fontWeight === 'bold') {
                        tagLabel.style.fontWeight = 'normal';
                        selectedTags.delete(exactTag); // store in Set of current selection
                    } else {
                        tagLabel.style.fontWeight = 'bold';
                        selectedTags.add(exactTag); // remove from Set of current selection
                    }
					console.log(selectedTags);
				});
				
				// locate and label the filter
				leaf.appendChild(tagPrefix);
				leaf.appendChild(tagLabel);
				
				// add the filter to the branch children
				branchChildren.appendChild(leaf);
			});
		} else if (typeof value === 'object') {
			// Recursively create branches if the value is an object
			const newBranch = document.createElement('div');
			newBranch.className = 'tag-branch';
			branchChildren.appendChild(newBranch); // Append to children container
			growTagTreeDivs(value, newBranch, currDepth + 1, newPath); // Recursive call
		}

		// Append children container to the branch div
		branchContainer.appendChild(branchChildren);

		// Toggle visibility of children when branch is clicked
		branchContainer.addEventListener('click', function(event) {
			event.stopPropagation();
			branchChildren.style.display = branchChildren.style.display === 'none' ? 'block' : 'none';
			branchChildren.style.display === 'block' ?
				branchPrefix.innerHTML = passingSymb.repeat(currDepth) + branchMinusSymb + spacing :
				branchPrefix.innerHTML = passingSymb.repeat(currDepth) + branchPlusSymb + spacing;
		});

		
		branch.appendChild(branchContainer);
	}
}

function initTagTree() {
	const tt = document.getElementById('tag-tree');
	tt.innerHTML = '';
	growTagTreeDivs(tagTree, tt, 0);
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
        if (tallyCount % 25 === 0) {
            const rowBreak = document.createElement('div');
            rowBreak.className = 'tally-row'; // Class for styling
            tallyContainer.appendChild(rowBreak);
        }
    }
    const header = document.getElementById('header');
    header.textContent = `Day ${tallyCount}`; // Set header to the static count value
}


document.addEventListener('DOMContentLoaded', () => {
    initTagTree();
    for (let i = 0; i < 999; i++) {
        addTallyMark(i+1);
    }    
});

// const scriptUrl = 'https://script.google.com/macros/s/AKfycbwEDXlCUE759nSrM-CXwvpPY44T1dr9AB3H09GjF6plK8s9lBX14O4WZJu-rppo69yS/exec?callback=loadArticles';
// loadJsonp(scriptUrl);

// Fetch articles on page load
window.onload = fetchArticles;