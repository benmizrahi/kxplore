import { IEnvironment } from  '../../../kxplore-shared-models/envierment'
import { Kafka, Admin } from 'kafkajs'
import { IJobInformation } from '../../../kxplore-shared-models/job-details';
import {TaskInfo} from '../../../kxplore-shared-models/task-info'
import { Injectable } from '@decorators/di';
const uuidv1 = require('uuid/v1');


@Injectable()
export class KafkaQueue  {

    describe = async (env:IEnvironment) =>  {
        const admin = new Kafka({
            clientId: 'kxplore',
             brokers:  env.props['brokers'].split(',')
        }).admin()

        admin.connect()



        admin.disconnect();
    }

    buildPlan = async (payload:IJobInformation):Promise<TaskInfo[]> =>  {
        const admin = new Kafka({
            clientId: '__kxplore',
             brokers:  payload.env.props['kafkaHost'].split(',')
        }).admin()
        admin.connect()
        const info =  await admin.fetchTopicOffsets(payload.connectionObject.topic)
        return this.flatten(info.map(this.buildPartition).map(this.buildTasks(payload)))
    }

    buildPartition = (distribution:{ partition: number; offset: string; high: string; low: string }):{partition:number, from:number,to:number} =>{
        return { partition: distribution.partition,from:parseInt(distribution.low),to:parseInt(distribution.high)}
    }
    
    buildTasks = (jobInfo:IJobInformation) =>(partitionPlan:{partition:number, from:number,to:number}):TaskInfo[]=>{
        const messagesPerTask = parseInt(jobInfo.env.props['max-messages-per-task']) || 10
        const lagMessages = partitionPlan.to - partitionPlan.from;
        let tasksNumber = 1;
        if(lagMessages > messagesPerTask){
            let reminder = messagesPerTask % lagMessages;
            tasksNumber = Math.round(lagMessages % messagesPerTask);
            if(reminder - tasksNumber > 0)
                tasksNumber++; //add the last reminder!
        }
        
        let tasksPerPartition:TaskInfo[] = [];
        let current = partitionPlan.from;
        while(tasksNumber > 0){
            let max = partitionPlan.from + messagesPerTask
            if(max > partitionPlan.to) max = partitionPlan.to; //set the max
            tasksPerPartition.push({partition:partitionPlan.partition, from:current,to:max,query:jobInfo.connectionObject.query,source:'Kafka',processed:false,processing:false,taskId:uuidv1(),env:jobInfo.env,worker:null})
            current = max;
            tasksNumber--;
        }

        return tasksPerPartition;
    } 

    flatten = (arr) => {
        return arr.reduce((flat, toFlatten)=> {
            return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
        }, []);
    }

}