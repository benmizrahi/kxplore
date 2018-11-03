import { Injectable, Inject } from "@decorators/di";
import { JWTAuthMiddleware } from "../middlewares/jwt-auth-middleware";

@Injectable()
export class DetailsRouter{

    constructor(
        @Inject(JWTAuthMiddleware) private readonly jwtMiddleware: JWTAuthMiddleware,
        @Inject('global-config') private readonly authConfig:{googleConfig:any,SECRET_KEY:string}){
      }

      register = (app) => {

        app.get('/api/env/details', [this.jwtMiddleware.authCall], async (req, res) => {

        })
      }


    }