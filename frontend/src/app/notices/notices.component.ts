import { Component, OnInit } from '@angular/core';
import NoticeHelper from '../_helpers/notice-helper';
import { NoticeService } from '../_services/notice.service';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {

  public services: any = [];
  public NoticeHelper = NoticeHelper;

  constructor(private noticeService: NoticeService) { }

  ngOnInit() {
  }

  public removeNotice(notice) {
    this.noticeService.drop(notice._id).subscribe(
      _ => {
        NoticeHelper.removeFromNotices(notice);
      },
      err => console.error(err)
    )
  }

}
