let booklist = []
let currentPage = 1
let itemsPerPage = 5

const fetchbookss = document.querySelector('#fetchbooks')
let mainContainer = document.querySelector('#books-container')
let paginationcontainer = document.querySelector('#pagination-container')
let searchingInput = document.querySelector('#search')
let sortingItem = document.querySelector('#sorting')

fetchbookss.addEventListener('click', async () => {
    await fetch('https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b')
        .then((response) => response.json())
        .then((data) => booklist = data.results.books)
        .catch((error) => console.error(error))
    displayBooks()
})

function displayBooks() {
    mainContainer.innerHTML = ""

    let filteredBooks = booklist.filter(book => book.title.toLowerCase().includes(searchingInput.value.toLowerCase()))

    // Sorting logic
    if (sortingItem.value == 'asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
    } else {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title))
    }

    // Pagination logic
    let paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, (currentPage * itemsPerPage))

    // Create table element
    let table = document.createElement('table')
    table.border = "1"
    table.cellPadding = "10"
    table.cellSpacing = "0"

    // Create table header
    let thead = document.createElement('thead')
    thead.innerHTML = `
        <tr>
            <th>Book Image</th>
            <th>Title</th>
            <th>Description</th>
        </tr>
    `
    table.appendChild(thead)

    // Create table body and populate with paginated books
    let tbody = document.createElement('tbody')

    paginatedBooks.forEach(book => {
        let row = document.createElement('tr')

        // Book image
        let imgCell = document.createElement('td')
        let bookimg = document.createElement('img')
        bookimg.src = book.book_image
        bookimg.height = 100
        bookimg.width = 100
        imgCell.appendChild(bookimg)
        row.appendChild(imgCell)

        // Title
        let titleCell = document.createElement('td')
        titleCell.textContent = book.title
        row.appendChild(titleCell)

        // Description
        let descCell = document.createElement('td')
        descCell.textContent = book.description
        row.appendChild(descCell)

        tbody.appendChild(row)
    })

    table.appendChild(tbody)
    mainContainer.appendChild(table)

    displayPagination(filteredBooks.length)
}

searchingInput.addEventListener('input', () => {
    currentPage = 1
    displayBooks()
})

sortingItem.addEventListener('change', () => {
    displayBooks()
})

function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    paginationcontainer.innerHTML = ""

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button')
        pageButton.textContent = i
        pageButton.addEventListener('click', () => {
            currentPage = i
            displayBooks()
        })
        paginationcontainer.appendChild(pageButton)
    }
}
