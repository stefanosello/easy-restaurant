import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ItemNode } from '../waiter-order-modal.component';

const TREE_DATA: ItemNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple', quantity: 3 },
      { name: 'Banana', quantity: 3 },
      { name: 'Fruit loops', quantity: 3 },
    ],
    quantity: 9
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli', quantity: 7 },
          { name: 'Brussel sprouts', quantity: 7 },
        ],
        quantity: 14
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins', quantity: 8 },
          { name: 'Carrots', quantity: 8 },
        ],
        quantity: 16
      },
    ],
    quantity: 32
  },
];

@Component({
  selector: 'app-order-tree',
  templateUrl: './order-tree.component.html',
  styleUrls: ['./order-tree.component.scss']
})
export class OrderTreeComponent implements OnInit {

  @Input('tree') tree: ItemNode;

  treeControl = new NestedTreeControl<ItemNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ItemNode>();

  constructor() {
  }

  hasChild = (_: number, node: ItemNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    console.log(this.tree);
    this.dataSource.data = this.tree.children;
  }

}
