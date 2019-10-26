import { Injectable } from "@decorators/di";
import { TaskInfo } from "../../kxplore-shared-models/task-info";
import { BatchResults } from "../../kxplore-shared-models/batch-results";
import { IJobInformation } from "../../kxplore-shared-models/job-details";
import * as alasql from 'alasql'

@Injectable()
export class KxploreResultsBuilder {

    build = (job:IJobInformation, tasks:TaskInfo[])=>{
        let DAG:{columns:[],from:[],group:[]} = (alasql.parse(job.connectionObject.query) as any).statements[0];
    }

    arrayUnique = (array) => {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
    
        return a;
    }
}