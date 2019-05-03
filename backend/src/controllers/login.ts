import jsonwebtoken from 'jsonwebtoken'
import { Handler } from 'express'

const login: Handler = (req, res) => {

  // If we reach this point, the user is successfully authenticated and
  // has been injected into req.user

  // We now generate a JWT with the useful user data
  // and return it as response

  var tokendata = {
    username: req.user.username,
    role: req.user.role,
    id: req.user.id
  };

  console.log("Login granted. Generating token");
  var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return res.status(200).json({ error: false, errormessage: "", token: token_signed });

}

export default login;