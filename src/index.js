const moment = require('moment');
import Chart from 'chart.js';

document.addEventListener("DOMContentLoaded", function() {
    const username = 'anas0-1';
    const token = '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'; 

    // Function to fetch Aside_user information
    async function fetchUserInfo(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch user information');
            }
    
            const data = await response.json();
    
            // membership years
            const joinDate = moment(data.created_at);
            const currentDate = moment();
            const membershipYears = currentDate.diff(joinDate, 'years');
    
            // DOM user info 
            document.getElementById("avatar").src = data.avatar_url;
            document.getElementById("name").textContent = data.name || "Not provided";
            document.getElementById("bio").textContent = data.bio || "No bio provided";
            document.getElementById("followers").textContent = data.followers || "Not provided";
            document.getElementById("following").textContent = data.following || "Not provided";
            document.getElementById("publicRepos").textContent = data.public_repos || "Not provided";
            document.getElementById("membershipYears").textContent = membershipYears;
    
            // Fetch country flag 
            if (data.location) {
                const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${data.location}`);
                const countryData = await countryResponse.json();
    
                if (countryData.length > 0 && countryData[0].flags) {
                    const flagUrl = countryData[0].flags.png;
                    document.getElementById("flagImage").src = flagUrl; 
                }
            }
        } catch (error) {
            
            console.error("Error fetching user information:", error);
        }
    }
    // Default fetch for the initial user
    fetchUserInfo(username);

    // Search Input
    const searchInput = document.getElementById("SearchUsername");
    const searchResults = document.getElementById("searchResults");
    const cardSection = document.getElementById("cards_section"); 
    let debounceTimer;

    async function handleSearchInput() {
    const searchTerm = searchInput.value.trim();

    // Clear debounce timer
    clearTimeout(debounceTimer);

    // Set a debounce timer
    debounceTimer = setTimeout(async () => {
        // Clear previous search results
        searchResults.innerHTML = '';
        //condition to check searchInput
        if (searchTerm.length > 0) {
            try {
                // Fetch GitHub users matching the searchInput
                const response = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
                const data = await response.json();

                // Looping 5 search results and creating divs for them
                for (let i = 0; i < 5 && i < data.items.length; i++) {
                    const userElement = document.createElement('div');
                    userElement.textContent = data.items[i].login;
                    searchResults.appendChild(userElement);
                }
                searchResults.classList.remove('hidden');
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        } else {
            searchResults.classList.add('hidden');
        }
    }, 500); 
}
    // keyup calling the handleSearchInput function
    searchInput.addEventListener("keyup", handleSearchInput);
    
    // Fetch repositories of the default user
    async function displayDefaultUserRepos() {
    const defaultUsername = "anas0-1";
    try {
        const response = await fetch(`https://api.github.com/users/${defaultUsername}/repos`);
        const data = await response.json();

        // Loop through each repository and create a card for it
        data.forEach(repo => {
            // Create a card HTML string for the repository
            const RepoCards = `
                <div class="flex flex-col bg-white shadow-md overflow-hidden p-2 max-w-sm rounded-lg cursor-pointer hover:bg-gray-100">
                    <h2 class="text-blue-600 text-left ml-2">${repo.name}</h2>
                    <p class="ml-2">${repo.description || "No description provided"}</p>
                </div>
            `;
            // Append the repository card HTML to the card section
            cardSection.innerHTML += RepoCards;
        });
    } catch (error) {
        console.error("Error fetching default user repositories:", error);
    }
}
    window.addEventListener('load', displayDefaultUserRepos);
    
    // Fetch repositories for the clicked user
    searchResults.addEventListener("click", async function(event) {
    try {
        // Get clicked username and trim the sides
        const username = event.target.textContent.trim();

        // Fetch repositories of the clicked user
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await response.json();

        // Clear previous repositories displayed in the card section
        cardSection.innerHTML = '';

        data.forEach(repo => {
    
            const RepoCards = `
                <div class="flex flex-col bg-white shadow-md overflow-hidden p-2 max-w-sm rounded-lg cursor-pointer hover:bg-gray-100">
                    <h2 class="text-blue-600 text-left ml-2">${repo.name}</h2>
                    <p class="ml-2">${repo.description || "No description provided"}</p>
                </div>
            `;

            cardSection.innerHTML += RepoCards;
        });

        searchResults.classList.add('hidden');
    } catch (error) {
        console.error("Error fetching user repositories:", error);
    }
});
    // Fetch clicked user infos and bio
    searchResults.addEventListener("click", async function(event) {
    const username = event.target.textContent.trim();

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();

        // Update HTML with user information
        document.querySelector('#_section .flex.flex-row.items-center.justify-center span').textContent = userData.login;
        document.querySelector('#_section div:nth-child(2) span').textContent = userData.bio || '';

        // Fetch country flag based on user's location
        if (userData.location) {
            const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${userData.location}`);
            const countryData = await countryResponse.json();

            if (countryData.length > 0 && countryData[0].flags) {
                const flagUrl = countryData[0].flags.png;
                document.getElementById("insight_flag").src = flagUrl; 
            }
        }

        // Hide the search results
        searchResults.classList.add('hidden');

    } catch (error) {
        console.error("Error fetching user information:", error);
    }
});
    // number of repos of the clicked user
searchResults.addEventListener("click", async function(event) {
    const username = event.target.textContent.trim();

    try {
        // Get the number of repositories for the user
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const reposData = await reposResponse.json();
        const numberOfRepos = reposData.length;

        const numberOfReposElement = document.getElementById("numberOfRepos");
        numberOfReposElement.textContent = `Number of Repos: ${numberOfRepos}`;

    } catch (error) {
        console.error("Error fetching user information:", error);
    }
});

});
// arrow top
document.getElementById('back-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // singlle page handle
  const toggleButton = document.getElementById('toggleButton');
    const section1 = document.getElementById('_section');
    const section2 = document.getElementById('cards_section');

    toggleButton.addEventListener('click', function() {
        // Toggle the visibility of the sections
        section1.classList.toggle('hidden');
        section2.classList.toggle('hidden');
    });
 