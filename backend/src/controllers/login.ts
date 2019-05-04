import { Handler } from 'express'
import User from '../models/user'

const login: Handler = (req, res, next) => {

  // If we reach this point, the user is successfully authenticated and
  // has been injected into req.user

  // We now generate a JWT with the useful user data
  // and return it as response

  let token;

  try {
    token = new User(req.user).generateToken();
  }
  catch(error) {
    next({ statusCode: 500, error: true, errormessage: "Error generating token"})
  }
  return res.status(200).json({ error: false, errormessage: "", token: token });

}

export default login;