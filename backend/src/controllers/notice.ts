import { Handler } from 'express';
import Notice from '../models/notice';
import User, { IUser } from '../models/user';

export const get: Handler = async (req, res, next) => {
  const user: IUser = new User(req.user);
  const userId = user.id;
  let query = Notice.find({to: userId}).sort({timestamp: -1}).populate({path: 'from', select: '_id username role'})
  if (req.query && req.query.limit) {
    query = query.limit(parseInt(req.query.limit.toString(), 10));
  }
  query
    .then(notices => {
      if (notices) {
        res.status(200).json({ notices });
      } else {
        return next({ statusCode: 404, error: true, errormessage: "No notice found" });
      }
    })
    .catch(
      err => next({
        statusCode: 500,
        error: true,
        errormessage: err
      })
    );
}

export const remove: Handler = async (req, res, next) => {
  const user: IUser = new User(req.user);
  const userId = user.id;
  const noticeId = req.params.noticeId;
  Notice.findOne({_id: noticeId})
    .then(notice => {
      if (notice) {
        notice.to = notice.to.filter(u => `${u}` !== userId);
        notice.save((err: any, _) => {
          if (err) {
            return next({ statusCode: 500, error: true, errormessage: "Notice DB errors" });
          }
          res.status(200).end();
        });
      } else {
        return next({ statusCode: 404, error: true, errormessage: "No notice found" });
      }
    })
    .catch(
      err => next({
        statusCode: 500,
        error: true,
        errormessage: err
      })
    );
}