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
    const formattedOrder: IdItemNode = formatOrderNodeForTree(order, index);
    orders.children.push(formattedOrder);
  });
  return orders;
}

export function formatTreeForDB(tree: ItemNode) {
  if (tree.children) {
    const result: any = {};
    tree.children.forEach((order: IdItemNode) => {
      result[order._id] = [];
      if (order.children) {
        order.children.forEach((item: IdItemNode) => {
          result[order._id].push({
            item: item._id,
            quantity: item.quantity
          });
        });
      }
    });
    return result;
  }
  return {};
}

export function formatOrderNodeForTree(order: Order, index) {
  console.log(order);
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
  return formattedOrder;
}
