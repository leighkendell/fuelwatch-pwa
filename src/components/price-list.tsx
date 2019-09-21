import React from 'react';
import { Card } from 'flwww';

interface Props {
  locations: any[];
}

const PriceList: React.FC<Props> = ({ locations }) => {
  console.log(locations);

  return (
    <Card title="Top 10 Prices">
      <ul>
        {locations.map(location => (
          <li>
            <strong>${location.price}</strong> {location.tradingName}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PriceList;
