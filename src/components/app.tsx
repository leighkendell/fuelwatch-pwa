import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { TopLoader, Drawer, message } from 'flwww';
import PriceList from './price-list';
import Map from './map';

const LOCATIONS = gql`
  {
    locations {
      tradingName
      price
      latitude
      longitude
      address
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery(LOCATIONS);

  useEffect(() => {
    if (error) {
      message('Oops, there was an error fetching fuel prices', 'error');
    }
  }, [error]);

  const toggleDrawer = () => {};

  return (
    <>
      <TopLoader loading={loading} />
      {data && (
        <>
          <Map markers={data.locations} />
          <Drawer showDrawer={false} toggleDrawer={toggleDrawer}>
            <PriceList locations={data.locations.slice(0, 10)} />
          </Drawer>
        </>
      )}
    </>
  );
};

export default App;
