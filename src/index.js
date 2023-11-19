import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where, orderBy,
    getDoc, updateDoc
} from 'firebase/firestore'

import {
    getAuth, createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

// above functions: collection and doc give refernece to collections and a particular doc respectively

const firebaseConfig = {
    apiKey: "AIzaSyCdNV-gCrW7mrEsvtxY38eMSq6I97urbtY",
    authDomain: "myfirebase111723.firebaseapp.com",
    projectId: "myfirebase111723",
    storageBucket: "myfirebase111723.appspot.com",
    messagingSenderId: "599863692353",
    appId: "1:599863692353:web:dafde40e5f4ca3a5df8ac0"
};

// init firebase
initializeApp(firebaseConfig)


// init services
const db = getFirestore()
const auth = getAuth()


// collection reference
const colRef = collection(db, 'books')


// queries
//const q = query(colRef, where("author", "==", "Paulo Coelho"))



// get real time collection data
onSnapshot(colRef, (snapshot)=>{
    let books = []
        snapshot.docs.forEach(doc => {
            books.push({ ...doc.data(), id: doc.id })
        })
        console.log(books)
})



// to display the data in list format
const allBooksQuery = query(colRef, orderBy('title', 'asc'));
const bookList = document.querySelector('.book-list');

onSnapshot(allBooksQuery, (snapshot) => {
    let booksHTML = ''; // Initialize an empty string to hold the HTML content

    snapshot.docs.forEach((doc) => {
        const bookData = doc.data();
        const title = bookData.title.toLowerCase();
        const author = bookData.author.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();

        // Filter by title or author based on search input
        if (title.includes(searchTerm) || author.includes(searchTerm) || searchTerm === '') {
            booksHTML += `<li>Title: ${bookData.title}, Author: ${bookData.author}</li>`;
        }
    });

    // Update the HTML content of the book list ul element
    bookList.innerHTML = booksHTML;
});

searchInput.addEventListener('input', () => {
    // Trigger the onSnapshot function again to filter books based on the search input
    // This will dynamically update the displayed list as the user types
    onSnapshot(allBooksQuery, (snapshot) => {
        let booksHTML = ''; 

    snapshot.docs.forEach((doc) => {
        const bookData = doc.data();
        const title = bookData.title.toLowerCase();
        const author = bookData.author.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();

        // Filter by title or author based on search input
        if (title.includes(searchTerm) || author.includes(searchTerm) || searchTerm === '') {
            booksHTML += `<li>Title: ${bookData.title}, Author: ${bookData.author}</li>`;
        }
    });

    // Update the HTML content of the book list ul element
    bookList.innerHTML = booksHTML;
    });
});




// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
    })
        .then(() => {
            addBookForm.reset()
        })
})



// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})


//get a single document
const docRef = doc(db, 'books', 'frjfvTNApwHxOeakAZkw')

onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})
    
// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(()=>{
        updateForm.reset()
    })
})



// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
  // cred means credential
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
      alert("user created successfully")
    })
    .catch(err => {
      alert(err.message)
    })
})


// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      alert('user successfully signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      alert('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      alert(err.message)
    })
})

function toggleCRUDOperations(user) {
    const addBookForm = document.querySelector('.add');
    const deleteBookForm = document.querySelector('.delete');
    const updateForm = document.querySelector('.update');

    if (user) {
        // Enable CRUD operations when user is logged in
        addBookForm.style.display = 'block';
        deleteBookForm.style.display = 'block';
        updateForm.style.display = 'block';
    } else {
        // Disable CRUD operations when user is not logged in
        addBookForm.style.display = 'none';
        deleteBookForm.style.display = 'none';
        updateForm.style.display = 'none';
    }
}

//subscribing to auth changes
onAuthStateChanged(auth, (user)=>{
    console.log("user status changed:", user)
    toggleCRUDOperations(user); // Toggle CRUD operations based on user login status
})



