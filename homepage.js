const tags = ["music", "sports", "intrigue", "art", "weather", "power", "gossip"];
console.log(tags);
let tallyCount = 31; // Initialize tally count

function loadArticles(data) {
    const container = document.getElementById('article-container');
    container.innerHTML = ''; // Clear existing articles

    if (!data || data.length === 0) {
        container.innerHTML = '<p>No articles found.</p>';
        return;
    }

    data.forEach((article, i) => {
        const articleGroup = document.createElement('div');
        articleGroup.className = 'article-group';

        // Create the article title
        const articleTitle = document.createElement('h2');
        articleTitle.className = 'article-title';
        articleTitle.textContent = article.title;

        // Toggle visibility of article content
        articleTitle.onclick = () => {
            const contentContainer = document.getElementById(`content-container-${i}`);
            contentContainer.style.display = contentContainer.style.display === 'block' ? 'none' : 'block';
        };

        // Create a container for content and media
        const contentContainer = document.createElement('div');
        contentContainer.id = `content-container-${i}`;
        contentContainer.style.display = i === 0 ? 'block' : 'none'; // Show the first article by default

        // Append content blocks and media in order
        article.content.forEach(contentItem => {
            if (contentItem.type === 'text') {
                const textBlock = document.createElement('p');
                textBlock.textContent = contentItem.value;
                contentContainer.appendChild(textBlock);
            } else if (contentItem.type === 'media') {
                const mediaElement = document.createElement('img');
                mediaElement.src = contentItem.value;
                mediaElement.alt = "Media uploaded with article";
                mediaElement.style.width = "100%";
                mediaElement.style.marginTop = "10px";
                contentContainer.appendChild(mediaElement);
            }
        });

        // Append title and content container to article group
        articleGroup.appendChild(articleTitle);
        articleGroup.appendChild(contentContainer);

        // Append the article group to the main container
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
            return response.json(); // Parse JSON response
        })
        .then(data => {
            console.log(data);
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

    // Calculate the number of rows
    const rowNum = Math.ceil(tallyCount / 10); // Get the current row index

    // Check if we need to create a new row
    let tallyRow = document.getElementById(`tally-row-${rowNum}`);
    if (!tallyRow) {
        tallyRow = document.createElement('div');
        tallyRow.className = 'tally-row';
        tallyRow.id = `tally-row-${rowNum}`;
        tallyContainer.appendChild(tallyRow);
    }

    // Choose a tally set (can be changed as needed)
    const chosenSet = 'c';

    // Create a tally link
    const tallyLink = document.createElement('a');
    tallyLink.className = 'tally-link';
    tallyLink.href = `article.html?timestamp=${Date.now()}`; // Use current timestamp for the href

    // Create a tally mark using the corresponding SVG
    const tallyCountMark = 5 - (tallyCount % 5);

    const tallyMark = document.createElement('img');
    tallyMark.className = 'tally-mark';
    if (tallyCountMark === 5) {
        tallyMark.style.height = '18px';
        tallyMark.style.marginTop = '7px';
        tallyMark.style.marginLeft = '-65px';
    }
    tallyMark.src = `./svgs/${chosenSet}${tallyCountMark}.svg`;
    tallyLink.appendChild(tallyMark);

    // Append the tally link to the current row
    tallyRow.appendChild(tallyLink);

    // Add spacing every 5 tallies
    if (tallyCount % 5 === 0 && tallyCount % 10 !== 0) {
        const spacer = document.createElement('div');
        spacer.className = 'tally-spacer';
        tallyRow.appendChild(spacer);
    }
}

function initTallyMarks(tallyCount) {
    for (let i = 0; i < tallyCount; i++) {
        addTallyMark(i+1);
    }
}

const header = document.getElementById('header');
header.textContent = "TEN TODAY"


function updateClock(timezone = 'Asia/Tokyo') {
    try {
        const now = new Date();

        // Format the current date and time for the specified timezone
        const options = {
            timeZone: timezone,
            hour12: true, // Set to false for 24-hour format
            // weekday: 'long', // e.g., 'Monday'
            year: 'numeric', // e.g., 2024
            month: 'numeric', // e.g., 'October'
            day: 'numeric', // e.g., '17'
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        // Get the formatted date and time string
        const formattedDateTime = now.toLocaleString('en-US', options);

        // Display the date and time in the target element
        const dateTimeElement = document.getElementById('date-time');
        if (dateTimeElement) {
            dateTimeElement.textContent = formattedDateTime;
        } else {
            console.warn('Element with ID "date-time" not found.');
        }
    } catch (error) {
        console.error('Error updating clock:', error);
    }
}

setInterval(() => updateClock('Asia/Tokyo'), 1000);

initTagTree();
 
initTallyMarks(tallyCount);

// Fetch articles on page load
window.onload = fetchArticles;