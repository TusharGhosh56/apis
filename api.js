let newsList = [];
        let currentPage = 1;
        const newsPerPage = 5;

        let mainContainer = document.querySelector('#news-container');
        let searchInput = document.querySelector('#search');
        let fetchNewsButton = document.querySelector('#fetchnews');
        let loginButton = document.querySelector('#login');
        let errorMessage = document.querySelector('#error-message');
        let successMessage = document.querySelector('#success-message');
        let prevPageButton = document.querySelector('#prevPage');
        let nextPageButton = document.querySelector('#nextPage');
        let pageInfo = document.querySelector('#pageInfo');
        let categoryFilter = document.querySelector('#categoryFilter');
        let sortDirection = document.querySelector('#sortDirection');  // Fix this variable

        // Regular expressions for validation
        const usernameRegex = /^[A-Za-z]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        loginButton.addEventListener('click', () => {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;

            if (usernameRegex.test(username) && passwordRegex.test(password)) {
                errorMessage.textContent = '';
                successMessage.textContent = 'Login successful!';
                enableSearch();
            } else {
                successMessage.textContent = '';
                errorMessage.textContent = 'Invalid login. Please try again.';
                disableSearch();
            }
        });

        function enableSearch() {
            fetchNewsButton.disabled = false;
            searchInput.disabled = false;
        }

        function disableSearch() {
            fetchNewsButton.disabled = true;
            searchInput.disabled = true;
        }

        const apiKey = '63b4fc19d6ce445796ef4aea1eba0478'; // Your API Key

        fetchNewsButton.addEventListener('click', async () => {
            const category = categoryFilter.value;
            const url = `https://newsapi.org/v2/top-headlines?country=us${category ? `&category=${category}` : ''}&apiKey=${apiKey}`;

            await fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching news: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    newsList = data.articles;
                    currentPage = 1; // Reset to the first page on new fetch
                    displayNews();
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        });

        function displayNews() {
            mainContainer.innerHTML = "";  // Clear the container

            let filteredNews = newsList.filter(news =>
                news.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                news.description.toLowerCase().includes(searchInput.value.toLowerCase())
            );

            let sortedNews = filteredNews.sort((a, b) => {
                return sortDirection.value === 'asc' ? new Date(a.publishedAt) - new Date(b.publishedAt) : new Date(b.publishedAt) - new Date(a.publishedAt);
            });

            let start = (currentPage - 1) * newsPerPage;
            let end = start + newsPerPage;
            let paginatedNews = sortedNews.slice(start, end);

            if (paginatedNews.length === 0) {
                mainContainer.innerHTML = "<p>No news available.</p>";
            }

            paginatedNews.forEach(news => {
                let card = document.createElement('div');
                card.classList.add('news-card');

                let title = document.createElement('h3');
                title.textContent = news.title;
                card.appendChild(title);

                let details = document.createElement('div');
                details.classList.add('news-details');
                details.innerHTML = `
            <p>${news.description || 'No description available.'}</p>
            <p><a href="${news.url}" target="_blank">Read more</a></p>
        `;
                card.appendChild(details);

                card.addEventListener('click', () => {
                    card.classList.toggle('active');
                });

                mainContainer.appendChild(card);
            });

            updatePaginationControls(filteredNews.length);
        }

        function updatePaginationControls(totalNews) {
            prevPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = (currentPage * newsPerPage) >= totalNews;
            pageInfo.textContent = `Page ${currentPage}`;
        }

        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNews();
            }
        });

        nextPageButton.addEventListener('click', () => {
            let filteredNews = newsList.filter(news =>
                news.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                news.description.toLowerCase().includes(searchInput.value.toLowerCase())
            );

            if ((currentPage * newsPerPage) < filteredNews.length) {
                currentPage++;
                displayNews();
            }
        });

        searchInput.addEventListener('input', () => {
            currentPage = 1; // Reset to the first page on search
            displayNews();
        });

        categoryFilter.addEventListener('change', () => {
            fetchNewsButton.click(); // Re-fetch news when category changes
        });

        sortDirection.addEventListener('change', () => {
            displayNews(); // Re-display news when sort direction changes
        });
