import * as mysql from 'mysql';
import { IHandler, IHandlerAction, IHandlerResults } from '../interfaces/IHandler';
import { DBAction, LoggerAction } from '../interfaces/enums';
import { Injectable, Inject } from '@decorators/di';
import { ILoggerHandler } from './loggerHandler';


export class DBActionResults implements IHandlerResults<DBAction> {
  status: boolean;
  action: DBAction;
  results?: any;
} 

@Injectable()
export class IDbHandler implements IHandler<DBAction> {
  //private connection string
  private readonly connection:mysql.Connection;

  //connection to mysql
  constructor(@Inject(ILoggerHandler) private readonly logger: IHandler<LoggerAction>,
    @Inject('global-config') private readonly config: {mysql:{host,user,password,database,port}}){
    this.logger = logger;
    this.config = config;
    this.connection = mysql.createConnection({
      host     : this.config.mysql.host,
      port: this.config.mysql.port,
      user     : this.config.mysql.user,
      password : this.config.mysql.password,
      database : this.config.mysql.database
      });

    this.connection.connect();
    logger.handle({action:LoggerAction.info,payload:"MySql Loaded!"})
  }

  //public function to execute opertion vs db
  async handle(handleParams: IHandlerAction<DBAction>): Promise<DBActionResults>  {
    try {
      let dbResults = await this.execute(handleParams.payload);
      return {
        status:true,
        action:handleParams.action,
        results:dbResults
      }
    }
    catch(ex){
      this.logger.handle({action:LoggerAction.error,payload:`db throws an error ${ex}`})
      return {
        status:false,
        action:handleParams.action,
        results:ex
      }
    }
  }

  private execute = (query):Promise<any> =>{
    console.info(`Executing Query ${query}`);
    return  new Promise((resolve, reject)=>{
       this.connection.query(query,(err,results)=>{
             if(err) {
              console.error(`Query Error:\n ${err}`);
               reject(err)
             }
             console.info(`Query Finished Sucssesfully`);
             resolve(results)
       })
     })
   }
   
}