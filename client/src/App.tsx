import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/graphql',  // Backend GraphQL endpoint
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem('id_token') || ''}`, // Get the token from localStorage
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
