import { RESTDataSource } from 'apollo-datasource-rest';
import parser from 'fast-xml-parser';

class FuelWatchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://www.fuelwatch.wa.gov.au/fuelwatch';
  }

  async getLocations() {
    const data = await this.get('fuelWatchRSS');
    const json = parser.parse(data);
    const { item: items } = json.rss.channel;

    return items.map(item => ({
      title: item.title,
      description: item.description,
      brand: item.brand,
      date: new Date(item.date).getTime() / 1000,
      price: item.price,
      tradingName: item['trading-name'],
      location: item.location,
      address: item.address,
      phone: item.phone,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  }
}

export default FuelWatchAPI;
