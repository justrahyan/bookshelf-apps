document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const searchInput = document.getElementById('search');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');

    bookForm.addEventListener('submit', addBook);
    searchInput.addEventListener('input', filterBooks);
    confirmDeleteButton.addEventListener('click', confirmDelete);
    cancelDeleteButton.addEventListener('click', closeDialog);

    loadBooks();
});

let bookIdToDelete = null;

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('isComplete').checked;
    const id = +new Date();

    const book = {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    };

    saveBook(book);
    renderBooks();
}

function saveBook(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    renderBooks();
}

function renderBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(book => renderBook(book));
}

function renderBook(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book-item');
    bookElement.setAttribute('data-id', book.id);
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.year}</p>
        <button id="delete" onclick="showDeleteDialog(${book.id})">Delete</button>
        <button id="complete" onclick="toggleBookStatus(${book.id})">
            ${book.isComplete ? 'Pindahkan ke Belum Dibaca' : 'Pindahkan ke Selesai Dibaca'}
        </button>
    `;

    if (book.isComplete) {
        document.getElementById('completeBookshelfList').appendChild(bookElement);
    } else {
        document.getElementById('incompleteBookshelfList').appendChild(bookElement);
    }
}

function showDeleteDialog(id) {
    bookIdToDelete = id;
    document.getElementById('delete-dialog').style.display = 'flex';
}

function closeDialog() {
    bookIdToDelete = null;
    document.getElementById('delete-dialog').style.display = 'none';
}

function confirmDelete() {
    if (bookIdToDelete !== null) {
        deleteBook(bookIdToDelete);
    }
    closeDialog();
}

function deleteBook(id) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.id !== id);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
}

function toggleBookStatus(id) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.map(book => {
        if (book.id === id) {
            book.isComplete = !book.isComplete;
        }
        return book;
    });
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
}

function filterBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const books = JSON.parse(localStorage.getItem('books')) || [];

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    filteredBooks.forEach(book => renderBook(book));
}
