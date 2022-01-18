// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class
class UI {
  static displayBooks() {
    const storedBooks = Store.getBooks();
    storedBooks.forEach((book) => UI.addBookToList(book));
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger delete">Delete</a></td>
    `;
    list.appendChild(row);
  }

  static deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `fixed-top alert alert-${className} alert-dismissible fade show`;
    message += ` <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> `;
    div.innerHTML = message;
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //Vanish in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// Store Class: Handle Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Events to Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event to add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert(`Please fill in all the fields`, "danger");
  } else {
    //Instantiate book
    const book = new Book(title, author, isbn);

    //Add book to list
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    // Clear Fields
    UI.clearFields();

    // Prevent default
    e.preventDefault();

    UI.showAlert("Book succesfully added", "success");
  }
});
// Event to remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target);

    // Remove book from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
  UI.showAlert("Book succesfully deleted", "info");
});
