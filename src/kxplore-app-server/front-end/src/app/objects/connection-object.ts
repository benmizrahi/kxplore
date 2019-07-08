export class ConnectionObject {
    topic: string;
    env:string;
    isOldest:boolean;
    timestamp:number;
    query:string;
    strategy:string;
    type:string;
    job_id?:number;


    getStreamingKey = () =>{
      return `${this.topic}|${this.env}|${this.type}`;
    }
  }
  