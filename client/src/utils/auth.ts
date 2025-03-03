// decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode(this.getToken() || '');
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token 
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    console.log("Received idToken:", idToken);  // Log the token
    if (idToken) {
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
    } else {
      console.error("No idToken received during login");
    }
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
