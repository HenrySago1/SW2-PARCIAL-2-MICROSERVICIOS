import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8081/graphql',  // tu endpoint GraphQL backend
  cache: new InMemoryCache(),
});

export default client;