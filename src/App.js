import { gql, useQuery } from '@apollo/client';
import React from 'react';
import './App.css';

const GET_POSTS = gql`
{
  products: allPosts(count: 10000) {
    createdAt
  }
}
`

function App() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <div></div>
  )
}

export default App;
