import { Inject, Injectable } from "@decorators/di";
import { KxploreWorkersHandler } from "../handlers/kxplore-workers-handler";

@Injectable()
export class WorkersSocketRoute{

  constructor(@Inject('global-config') private readonly config:any,
              @Inject(KxploreWorkersHandler) private readonly workersHandler:KxploreWorkersHandler){}
 
  register = (io:SocketIO.Server) => {
    io.of('/workers').on('connection', (socket)=>{
        this.workersHandler.connect(socket.handshake.query.uuid,socket)
        socket.on('disconnect', ()=>{
            this.workersHandler.disconnect(socket.handshake.query.uuid);
         });
      });
  }
}