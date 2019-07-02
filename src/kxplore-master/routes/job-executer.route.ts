import { Inject, Injectable } from "@decorators/di";
import * as express from 'express';
import {IDescribeRequest, IStartJob,ISubscribeRequest} from '../../kxplore-shared-models/master/server-requests'
import {IDescribeResponse, IStartJobResponse} from '../../kxplore-shared-models/master/server-response'
import { KxploreWorkersHandler } from "../handlers/kxplore-workers-handler";
import { KxploreMasterHandler } from "../handlers/kxplore-master-handler";
import { matchPatten } from "../handlers/describers/IDescibable";
const uuidv1 = require('uuid/v1');

@Injectable()
export class JobExecuterRoute{

  constructor(@Inject('global-config') private readonly config:any,
              @Inject(KxploreMasterHandler) private readonly masterHandler:KxploreMasterHandler,
              @Inject(KxploreWorkersHandler) private readonly kxploreWorkersHandler:KxploreWorkersHandler){}

  register = (app:express.Application,io:SocketIO.Server) => {

    app.post('/api/describe', async (req:express.Request, res:express.Response) => {
      try {
          let payload:IDescribeRequest = req.body 
          let results = await this.masterHandler.describe(payload.env,matchPatten(payload.env));
          let response:IDescribeResponse = {status:true,message:'OK',results:results};
          res.status(200).send(response)
      }
      catch(ex){
        res.status(500).send({status:false,message:`ERROR - ${ex}`});
      }
    })

    app.post('/api/job/new',async (req:express.Request, res:express.Response) =>{
      try {
          let payload:IStartJob = req.body 
          const uuid = uuidv1();
          await this.masterHandler.start({env:payload.env,payload:payload.params,uuid:uuid,userId:payload.userId,fromOffset:payload.fromOffset});
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
        this.kxploreWorkersHandler.subscribe(jobId).on(`MESSAGES_${jobId}`,data => {
            socket.emit(`MESSAGES_${jobId}`,data)
         })

         socket.on(`STOP_JOB_${jobId}`, ()=>{
            this.kxploreWorkersHandler.stopJob(jobId);
         });

        socket.on('disconnect', ()=>{
          this.kxploreWorkersHandler.stopJob(jobId);
        });
      })
  }
}