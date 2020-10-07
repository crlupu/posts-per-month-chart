import { gql, useQuery } from '@apollo/client';
import React from 'react';
import './App.css';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { GridRows } from '@visx/grid';

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

  if (loading) return <div className="chartWrapper"><div className="loadingSpinner"></div></div>
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
    <div className="chartWrapper">
      <svg width={width} height={height}>
        <LinearGradient from="#1c6ca1" to="#07b4d4" id="barGradient" />
        <rect width={width} height={height} fill='#131e3a' rx={14} />
        <Group top={40} left={80}>
          <GridRows scale={yScale} width={xMax} height={yMax} />
          <AxisLeft
                left={0}
                labelOffset={45}
                scale={yScale}
                numTicks={10}
                label="Number of Posts"
                stroke="white"
                tickStroke="white"
                labelClassName="axisLabel"
                labelProps={() => ({
                  fill: 'white',
                  dy: '2em',
                  textAnchor: 'middle'
                })}
                tickLabelProps={() => ({
                  fill: 'white',
                  textAnchor: 'end',
                  dy: '0.33em',
                  dx: '-0.3em'
                })}
          />
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
                fill="url(#barGradient)"
              />
            )
          })};
          <AxisBottom
            scale={xScale}
            label="Month"
            labelOffset={25}
            top={yMax}
            stroke="white"
            tickStroke="white"
            hideAxisLine={true}
            hideTicks={true}
            labelClassName="axisLabel"
            tickLabelProps={() => ({
              fill: 'white',
              textAnchor: 'middle'
            })}
            labelProps={() => ({
              fill: 'white'
            })}
          />
        </Group>
      </svg>
    </div>
  )
}

export default App;
