export class User {
  readonly _id: string;
  username: string;
  password: string;
  name: {
    first: string,
    last: string
  }
  role: string;
  sessions: [{
    ip: string,
    token: string
  }]
}
