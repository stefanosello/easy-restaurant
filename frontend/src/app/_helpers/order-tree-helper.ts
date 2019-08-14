import { Item, Order } from 'src/app/_models/order';
import { Table } from '../_models/table';

export interface ItemNode {
  name: string;
  quantity: number;
  children?: ItemNode[] | IdItemNode[];
  touched?: boolean;
}

interface IdItemNode extends ItemNode {
  _id: string;
}

export function formatOrdersForTree(source: Order[], treeName: string) {
  const orders: ItemNode = {
    name: treeName,
    quantity: source.length,
    children: []
  };
  source.forEach((order, index) => {
    const formattedOrder: IdItemNode = {
      name: `Order #${index}`,
      quantity: order.items.length,
      children: [],
      _id: order._id
    };
    order.items.forEach((item: Item) => {
      formattedOrder.children.push({
        name: item.item.name,
        quantity: item.quantity,
        _id: item.item._id
      });
    });
    orders.children.push(formattedOrder);
  });
  return orders;
}

export function formatTreeForOrders(tree: ItemNode, table: Table) {
  return -1;
}
