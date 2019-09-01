import { Component, OnInit } from '@angular/core';
import NoticeHelper from '../_helpers/notice-helper'; 

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {

  public services: any = [];
  public NoticeHelper = NoticeHelper;

  constructor() { }

  ngOnInit() {
  }

}
