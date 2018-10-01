import { Injectable, Inject } from "@decorators/di";
import { IHandler, IHandlerAction, IHandlerResults } from "../interfaces/IHandler";
import { ChartActions, DBAction } from "../interfaces/enums";
import { IDbHandler } from "./dbHandler";


@Injectable()
export class ChartsHandler implements IHandler<ChartActions>{

    constructor(@Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>){}

    handle(handleParams: IHandlerAction<ChartActions>): Promise<IHandlerResults<ChartActions>> {
        return  new Promise(async(resolve, reject)=>{
            switch(handleParams.action){
                case ChartActions.get:
                try {
                    let res = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                            select cp.* from charts_properties cp
                            join charts_mapping cm on cm.cId = cp.id
                            where cm.uId = ${handleParams.payload.uId}`})

                    resolve({action:ChartActions.get,results:res.results,status:true});
                }
                catch(e) {
                    console.error(`error while geting users charts:`,e)
                    reject(e);
                }
                break;
                case ChartActions.delete:
                try {
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                                delete from charts_mapping 
                                where cId = ${handleParams.payload.cId}`})
        
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    delete from charts_properties 
                    where id = ${handleParams.payload.cId}`})

                    return this.handle({action:ChartActions.get,payload:handleParams.payload.uId})
                }
                catch(e) {
                    console.error(`error while deleting user chart:`,e)
                    reject(e);
                }
                case ChartActions.update:
                    return this.handle({action:ChartActions.get,payload:handleParams.payload.uId})
            }
        });

    }
}