import { Injectable, Inject } from "@decorators/di";
import * as express from 'express'
import { JobExecuterRoute } from "./routes/job-executer.route";
import * as http from 'http';
const  bodyParser  = require( 'body-parser' );
const cookieParser  = require( 'cookie-parser' );
import * as cors from 'cors';
import { WorkersSocketRoute } from "./routes/workers-api.route";

@Injectable()
export class Server {
    
    constructor(@Inject('global-config') private config: any,
                @Inject(JobExecuterRoute) jobExecuterRoute:JobExecuterRoute,
                @Inject(WorkersSocketRoute) workersSocketRoute:WorkersSocketRoute){
         const app = express();
        let server = this.initServer(app)
        app.use(cors({credentials: true, origin: '*'}));
        app.use( cookieParser());
        app.use( bodyParser.json());
        app.use( bodyParser.urlencoded({
          extended: true
        }));
        var io:SocketIO.Server = require('socket.io')(server,{
            upgradeTimeout: 30000,
            transports: ['websocket'],
            allowUpgrades: false,
            pingTimeout: 30000,
        });
        jobExecuterRoute.register(app,io);
        workersSocketRoute.register(io);       
    }
  
    private initServer(app){
        const server = http.createServer(app);
        server.listen(3001,()=>{
            console.log(`start listen at port 3001`)
        });
        return server
    }
}

