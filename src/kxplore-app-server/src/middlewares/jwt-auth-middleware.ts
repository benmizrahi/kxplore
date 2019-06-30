import * as jwt from 'jsonwebtoken'
import { Injectable, Inject } from '@decorators/di';

@Injectable()
export class JWTAuthMiddleware {

    constructor(@Inject('global-config') private config: any){}

    authCall=(req:any,res:any,next:any)=>{
        let bearerHeader:string = req.headers['authorization'];
        if(!bearerHeader) {
            console.log("token not supplied");
            res.json({success: false, message: 'Authentication failed'});
        }
        else {  
            let bearer:Array<string> = bearerHeader.split(" ");
            if(!(bearer.length == 2)) {
                console.error(`token format is not valid header: ${bearerHeader}`);
                res.json({success: false, message: 'Authentication failed'});
            }else {
                jwt.verify(bearer[1], this.config.authConfig['SECRET_KEY'], (err, decoded) => {
                    if (err) {
                        console.error(`token is not valid ${bearer[1]}`);
                        res.json({success: false, message: 'Authentication failed'});
                    } else {
                        req['__decoded_token'] = decoded;
                        next()
                    }
                });
            }
        }
    };
}
//
