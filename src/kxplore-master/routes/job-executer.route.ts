import { Inject, Injectable } from "@decorators/di";
import * as express from 'express';
import {IDescribeRequest, IStartJob,ISubscribeRequest} from '../../kxplore-shared-models/master/server-requests'
import {IDescribeResponse, IStartJobResponse} from '../../kxplore-shared-models/master/server-response'
import { KxploreWorkersHandler } from "../handlers/kxplore-workers-handler";
import { KxploreMasterHandler } from "../handlers/kxplore-master-handler";
const uuidv1 = require('uuid/v1');

@Injectable()
export class JobExecuterRoute{

  constructor(@Inject('global-config') private readonly config:any,
              @Inject(KxploreMasterHandler) private readonly masterHandler:KxploreMasterHandler){}

  register = (app:express.Application,io:SocketIO.Server) => {

    app.post('/api/job/new',async (req:express.Request, res:express.Response) =>{
      try {
          let payload:IStartJob = req.body 
          const uuid = uuidv1();
          await this.masterHandler.start({env:payload.env,connectionObject:payload.connectionObject,job_uuid:uuid});
          let response:IStartJobResponse = {status:true,message:'OK',uuid:uuid};
         res.status(200).send(response)
      }
      catch(ex){
        res.status(500).send({status:false,message:`ERROR - ${ex}`});
      }
    })

    io.of('/subscribe')
       .on('connection',(socket:SocketIO.Socket)=>{
         const jobId = socket.request._query['uuid'];


       // socket.emit(`MESSAGES_${jobId}`,data)

        socket.on(`STOP_JOB_${jobId}`, ()=>{
          this.masterHandler.stop(jobId);
        });
        socket.on('disconnect', ()=>{
              this.masterHandler.stop(jobId);
        });
      })
  }
}