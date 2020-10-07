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

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const postsByMonth = Array.from(months, x => ({label: x, value: 0}));

  data.products.forEach(p => {
    const date = new Date(parseInt(p.createdAt));
    if (date.getFullYear() === 2019) {
      postsByMonth[date.getMonth()].value++;
    }
  });

  console.log(postsByMonth);
  return (
    <div></div>
  )
}

export default App;
