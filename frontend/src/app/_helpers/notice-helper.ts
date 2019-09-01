import { NoticeService } from '../_services/notice.service';
import { cloneDeep } from 'lodash';

// tslint:disable-next-line: only-arrow-functions
export default (function () {
  let notices: any[] = [];

  function initNotices(service) {
    service.get().subscribe(
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
    notices = notices.filter(n => n._id !== notice._id);
  }

  function getNotices() {
    return cloneDeep(notices);
  }

  return { initNotices, pushToNotices, removeFromNotices, getNotices };

})();