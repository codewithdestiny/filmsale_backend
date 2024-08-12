import jwt from 'jsonwebtoken';

const verifJwt = (req, res, next) => {

    const authHeader = req.headers;

    const authorizationHeader = authHeader?.authorization;

    if(!authorizationHeader) return res.sendStatus(401);

    
    const token = authorizationHeader?.split(' ')[1];
    
    if(!token) return res.sendStatus(401);

    //verify jwt
    jwt.verify(token, process.env.ACCESSTOKEN_SECRET, function(err, decoded){

        if(err) return res.sendStatus(401);

        req.user = decoded;


    })
    next();
}

export default verifJwt;