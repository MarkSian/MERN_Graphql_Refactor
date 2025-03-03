import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

// Utility function to validate response status and throw an error if not successful
const checkResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json(); // Return JSON data if successful
};

// Fetch the logged-in user's information (requires token)
export const getMe = (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse) // Validate response
    .catch((error) => {
      console.error('Failed to fetch user info:', error);
      throw error; // Handle error in the component
    });
};

// Send a request to create a new user
export const createUserRequest = (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// Send a request to log in a user
export const loginUser = (userData: User) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Failed to log in:', error);
      throw error;
    });
};

// Save book data for the logged-in user
export const saveBook = (bookData: Book, token: string) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Error saving book:', error);
      throw error;
    });
};

// Remove saved book data for the logged-in user
export const deleteBook = (bookId: string, token: string) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Error deleting book:', error);
      throw error;
    });
};

// Make a search to Google Books API
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then(checkResponse)
    .catch((error) => {
      console.error('Error searching Google Books:', error);
      throw error;
    });
};
