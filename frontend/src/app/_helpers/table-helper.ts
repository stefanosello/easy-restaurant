import { Table, Service } from 'src/app/_models/table';

export function nullService() {
  let nullService: Service = new Service();
  nullService = new Service;
  nullService.covers = 0;
  nullService.orders = [];
  nullService.done = true;
  return nullService;
}


export function activeService(table: Table) {
  if (!table.busy) {
    return nullService();
  } else {
    return table.services.find(service => service.done == false);
  }
}

export function foodOrders(table: Table) {
  let service: Service = activeService(table);
  let foodOrders = service.orders.filter(order => order.type === "food");
  return foodOrders;
}

export function beverageOrders(table: Table) {
  let service: Service = activeService(table);
  let beverageOrders = service.orders.filter(order => order.type === "beverage");
  return beverageOrders;
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