import { Injectable, Inject } from "@decorators/di";
import { JWTAuthMiddleware } from "../middlewares/jwt-auth-middleware";
import { ChartsHandler } from "../handlers/chartsHandler";
import { ChartActions } from "../interfaces/enums";
import { IHandler } from "../interfaces/IHandler";

@Injectable()
export class ChartsRouter{

    constructor(
        @Inject(JWTAuthMiddleware) private readonly jwtMiddleware: JWTAuthMiddleware,
        @Inject(ChartsHandler) private readonly chartsHandler: IHandler<ChartActions>,
        @Inject('global-config') private readonly authConfig:{googleConfig:any,SECRET_KEY:string}){
      }

      
      register = (app) => {
   
        app.get('/api/charts/get', [this.jwtMiddleware.authCall], async (req, res) => {
            try{ 
                    let resutls = await this.chartsHandler.handle({action:ChartActions.get,payload:{
                        uId:req['__decoded_token']
                    }});
                    res.json(resutls.results);
                }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });
        
    }


    
}