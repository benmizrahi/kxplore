import { Injectable, Inject } from "@decorators/di";
import { IDbHandler } from "./db-handler";
import {DBAction} from '../interfaces/enums'
import * as superagent from 'superagent';
import * as io from 'socket.io-client';

@Injectable()
export class CommunicationHandler{

    private envierments:{[env:string]:any} = null

    constructor(@Inject(IDbHandler) private readonly dbHandler:IDbHandler){
       
    }


    createNewJob = async (env,topic):Promise<string> => {
        return  new Promise<string>(async (resolve,reject)=>{
            if(!this.envierments){
                await this.initEnvs()
            }
            superagent.post(`http://${process.env.MASTER_HOST}/api/job/new`)
                .send({ 
                    env:{
                        type:"Kafka",
                        props:this.envierments[env]
                    },
                    params:{
                        topic:topic
                    }
                })
                .end((err, res) => {
                    if(err){
                        reject(`unable to connect to master node! ${JSON.stringify(err)}`)
                    }else
                        resolve(res.body['uuid'])
                });
       });
    }

    createJobIDSocket = async (uuid,callback) => {
        const socket = io.connect(`http://${process.env.MASTER_HOST}/subscribe?uuid=${uuid}`, { reconnect: true });
        socket.on(`MESSAGES_${uuid}`, (data) => {
            console.debug(`app get data ...`)
            callback(data.payload);
        });
    }


    private initEnvs = async () => {
         let db = await this.dbHandler.handle({action:DBAction.executeSQL,payload:
             `select envName,props from dim_envierments`})
         this.envierments = {}
         db.results.forEach(row => {
             this.envierments[row.envName] = JSON.parse(row.props)
         });
     }

    
}