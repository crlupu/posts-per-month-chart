import { gql, useQuery } from '@apollo/client';
import React from 'react';
import './App.css';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';

const GET_POSTS = gql`
{
  products: allPosts(count: 10000) {
    createdAt
  }
}
`

const getMonth = d => d.label;
const getMonthPosts = d => d.value;

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

  const width = 850;
  const height = 500;

  const xMax = width - 100;
  const yMax = height - 120;

  const xScale = scaleBand({
    range: [0, xMax],
    domain: postsByMonth.map(getMonth),
    padding: 0.5
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, Math.max(...postsByMonth.map(getMonthPosts))]
  });

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill='lightblue' rx={14} />
        <Group top={60} left={80}>
          {postsByMonth.map(p => {
            const month = getMonth(p);
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - yScale(getMonthPosts(p));
            const barX = xScale(month);
            const barY = yMax - barHeight;

            return (
              <Bar
                key={`bar-${month}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="red"
              />
            )
          })};
        </Group>
      </svg>
    </div>
  )
}

export default App;
