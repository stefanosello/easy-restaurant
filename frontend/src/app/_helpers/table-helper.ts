import { Table, Service } from 'src/app/_models/table';
import { Order } from '../_models/order';

export function nullService() {
  const service: Service = new Service();
  service.covers = 0;
  service.orders = [];
  service.done = true;
  return service;
}


export function activeService(table: Table) {
  if (!table.busy) {
    return nullService();
  } else {
    const s = table.services.find(service => !service.done);
    return s;
  }
}

export function foodOrders(table: Table) {
  const service: Service = activeService(table);
  const orders = service.orders.filter(order => order.type === 'food');
  return orders;
}

export function beverageOrders(table: Table) {
  const service: Service = activeService(table);
  const orders = service.orders.filter(order => order.type === 'beverage');
  return orders;
}

export function processedFoodOrders(table: Table) {
  return foodOrders(table).filter(order => order.processed != null);
}

export function processedBeverageOrders(table: Table) {
  return beverageOrders(table).filter(order => order.processed != null);
}

export function pendingFoodOrders(table: Table) {
  return foodOrders(table).filter(order => order.processed == null);
}

export function pendingBeverageOrders(table: Table) {
  return beverageOrders(table).filter(order => order.processed == null);
}

export function getOrders(table: Table, type: string, processed: boolean) {
  const service = this.table.services.find((srv: Service) => !srv.done);
  let filteredOrders = service.orders ? service.orders : [];
  if (filteredOrders.length > 0) {
    if (type) {
      filteredOrders = filteredOrders.filter((order: Order) => order.type === type);
    }
    if (processed) {
      filteredOrders = filteredOrders.filter((order: Order) => processed ? filteredOrders.processed : !filteredOrders.processed);
    }
  }
  return filteredOrders;
}
