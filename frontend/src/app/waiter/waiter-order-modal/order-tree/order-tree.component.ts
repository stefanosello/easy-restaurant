import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ItemNode } from '../waiter-order-modal.component';

@Component({
  selector: 'app-order-tree',
  templateUrl: './order-tree.component.html',
  styleUrls: ['./order-tree.component.scss']
})
export class OrderTreeComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('tree') tree: ItemNode;

  treeControl = new NestedTreeControl<ItemNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ItemNode>();
  addingNewItem = false;
  newItem = {
    quantity: 1,
    name: ''
  };

  constructor() {
  }

  hasChild = (_: number, node: ItemNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    console.log(this.tree);
    this.dataSource.data = this.tree.children;
  }

}
