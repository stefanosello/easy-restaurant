import { NoticeService } from '../_services/notice.service';
import { cloneDeep } from 'lodash';

// tslint:disable-next-line: only-arrow-functions
export default (function () {
  let notices: any[] = [];
  let noticeService: NoticeService;

  function initNotices(service) {
    noticeService = service;
    noticeService.get().subscribe(
      (result: any) => {
        notices = result.notices;
      },
      err => console.error(err)
    );
  }

  function pushToNotices(notice) {
    notices.push(notice);
  }

  function removeFromNotices(notice) {
    noticeService.drop(notice._id).subscribe(
      _ => {
        notices = notices.filter(n => n._id !== notice._id);
      },
      err => console.error(err)
    )
  }

  function getNotices() {
    return cloneDeep(notices);
  }

  return { initNotices, pushToNotices, removeFromNotices, getNotices };

})();