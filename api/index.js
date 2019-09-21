import { ApolloServer, gql } from 'apollo-server-micro';
import FuelWatchApi from './data-source';

const typeDefs = gql`
  type Location {
    title: String
    description: String
    brand: String
    date: String
    price: Float
    tradingName: String
    location: String
    address: String
    phone: String
    latitude: Float
    longitude: Float
  }

  type Query {
    locations: [Location]
  }
`;

const resolvers = {
  Query: {
    locations: async (_source, { id }, { dataSources }) => {
      return dataSources.fuelWatchApi.getLocations();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      fuelWatchApi: new FuelWatchApi(),
    };
  },
  introspection: true,
  playground: true,
});

module.exports = server.createHandler({ path: '/api' });
