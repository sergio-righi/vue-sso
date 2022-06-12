import { ConfigUtil } from "@/utils";

export default (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization;
    const secretKey = ConfigUtil.get('api');
    if (token && token === secretKey) next();
    else throw new Error("401")
  } catch (err) {
    err === 401 ? res.status(401) : res.end();
  }
};

// export default (req: any, _: any, next: any) => {
//   const authorization = req.headers.authorization;

//   if (!authorization) {
//     const error: any = new Error("Not authenticated.");
//     error.statusCode = 401;
//     throw error;
//   }

//   const token = authorization.split(" ")[1];

//   let decodedToken: any;
//   try {
//     decodedToken = auth.verify(token, String(env.JWT_ACCESS));
//   } catch (err: any) {
//     err.statusCode = 500;
//     throw err;
//   }

//   if (!decodedToken) {
//     const error: any = new Error("Not authenticated.");
//     error.statusCode = 401;
//     throw error;
//   }
//   req.userId = decodedToken.userId;
//   next();
// };