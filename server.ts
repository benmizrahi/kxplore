import * as express from 'express'
import * as cors from 'cors';
import * as path from 'path'
import {Injectable, Inject, Container} from '@decorators/di'
import { JWTAuthMiddleware } from './middlewares/jwt-auth-middleware';
import { AuthenticationRouter } from './routes/authentication-router';
import { StreamRouter } from './routes/stream-router';
import { ManagmentRouter } from './routes/management-router';
import { ChartsRouter } from './routes/charts-router';


const  bodyParser  = require( 'body-parser' );
const cookieParser  = require( 'cookie-parser' );
const http = require('http');

@Injectable()
export class Server {

  constructor(@Inject('global-config') private config: any,
              @Inject(JWTAuthMiddleware) jwtAuthMiddleware:JWTAuthMiddleware,
              @Inject(AuthenticationRouter) authenticationRouter:AuthenticationRouter,
              @Inject(ManagmentRouter) managmentRouter:ManagmentRouter,
              @Inject(StreamRouter) streamRouter:StreamRouter,
              @Inject(ChartsRouter) chartsRouter:ChartsRouter){
    
    const app = this.initApp()
    const server = this.initServer(app);
    authenticationRouter.register(app);
    managmentRouter.register(app);
    chartsRouter.register(app);
    streamRouter.register(server);

    app.use(express.static(path.join(__dirname, 'dist')));
    const allowedExt = [
      '.js',
      '.ico',
      '.css',
      '.png',
      '.jpg',
      '.woff2',
      '.woff',
      '.ttf',
      '.svg',
    ];
    
    app.get('*', (req: Request, res: any) => {
      if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve(`dist/${req.url}`));
      } else {
        res.sendFile(path.resolve('dist/index.html'));
      }
    });
  } 

  private initApp(){
    const app = express();
    app.use(cors({credentials: true, origin: '*'}));
    app.use( cookieParser());
    app.use( bodyParser.json());
    app.use( bodyParser.urlencoded({
      extended: true
    }));
    return app
  }

  private initServer(app){
    const server = http.createServer(app);
    server.listen(3000,()=>{
        console.log(`start listen at port 3000`)
    });
    return server
  }
}