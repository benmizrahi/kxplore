import { Injectable, Inject } from "@decorators/di";
import { IDbHandler } from "../handlers/dbHandler";
import { IHandler } from "../interfaces/IHandler";
import { DBAction, LoggerAction } from "../interfaces/enums";
import { ILoggerHandler } from "../handlers/loggerHandler";
import { JWTAuthMiddleware } from "../middlewares/jwt-auth-middleware";
import { User } from "../dataModels/user";

@Injectable()
export class ManagmentRouter{

    constructor(
        @Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>,
        @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
        @Inject(JWTAuthMiddleware) private readonly jwtMiddleware: JWTAuthMiddleware,
        @Inject('global-config') private readonly authConfig:{googleConfig:any,SECRET_KEY:string,superuser:any}){
      }


    register = (app) => {
   
        app.get('/api/envierments/get', [this.jwtMiddleware.authCall], async (req, res) => {
            try{ 
                    let resutls = await this.getEnvierments();
                    res.json(resutls);
                }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/envierments/save', [this.jwtMiddleware.authCall], async (req, res) => {
            try{
                if(req.body.id) {
                    let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        UPDATE dim_envierments
                        SET envName = '${req.body.envName}',
                            props = '${JSON.stringify(req.body.props)}'
                        WHERE id = ${req.body.id}
                    `})
                }else{
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        insert into .dim_envierments (envName,props)
                        values('${req.body.envName}','${JSON.stringify(req.body.props)}');
                `})
                }
                res.json(await this.getEnvierments())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/envierments/delete', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    DELETE FROM  .dim_envierments
                    WHERE id = ${req.body.id}
                `})
                res.json(await this.getEnvierments())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        /* Manage Topics get/save/delete  */
        app.get('/api/topics/get', [this.jwtMiddleware.authCall], async (req, res) => {
            try{ 
                    let resutls = await this.getTopics();
                    res.json(resutls);
                }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/topics/save', [this.jwtMiddleware.authCall], async (req, res) => {
            try{
                if(req.body.id) {
                    let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        UPDATE .dim_topics
                        SET 
                            envId = '${req.body.envId}',
                            topicName = '${req.body.topicName}'
                        WHERE id = ${req.body.id}
                    `})
                }else{
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        insert into .dim_topics (envId,topicName)
                        values('${req.body.envId}','${req.body.topicName}');
                `})
                }
                res.json(await this.getTopics())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/topics/delete', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    DELETE FROM  .dim_topics
                    WHERE id = ${req.body.id}
                `})
                res.json(await this.getTopics())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });       
        
        /* Manage Topics get/save/delete  */
        app.get('/api/topics/get', [this.jwtMiddleware.authCall], async (req, res) => {
            try{ 
                    let resutls = await this.getTopics();
                    res.json(resutls);
                }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/topics/save', [this.jwtMiddleware.authCall], async (req, res) => {
            try{
                if(req.body.id) {
                    let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        UPDATE .dim_topics
                        SET 
                            envId = '${req.body.envId}',
                            topicName = '${req.body.topicName}'
                        WHERE id = ${req.body.id}
                    `})
                }else{
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        insert into .dim_topics (envId,topicName)
                        values('${req.body.envId}','${req.body.topicName}');
                `})
                }
                res.json(await this.getTopics())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/topics/delete', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    DELETE FROM  .dim_topics
                    WHERE id = ${req.body.id}
                `})
                res.json(await this.getTopics())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

         /* Manage users get/save/delete  */
        app.get('/api/user/get', [this.jwtMiddleware.authCall], async (req, res) => {
                    try{ 
                            let resutls = await this.getUsers();
                            res.json(resutls);
                        }
                    catch(e) {
                        console.error(JSON.stringify(e))
                        throw new Error(e);
                    }
                });
        
        app.post('/api/user/save', [this.jwtMiddleware.authCall], async (req, res) => {
                    try{
                        if(req.body.id) {
                            let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                                UPDATE .users
                                SET 
                                    email = '${req.body.email}',
                                    isAdmin = ${req.body.isAdmin}
                                WHERE id = ${req.body.id}
                            `})
                        }else{
                            await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                                insert into .users (email,isAdmin)
                                values('${req.body.email}',${req.body.isAdmin});
                        `})
                        }
                        res.json(await this.getUsers())
                    }
                    catch(e) {
                        console.error(JSON.stringify(e))
                        throw new Error(e);
                    }
                });
        
        app.post('/api/user/delete', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    DELETE FROM  .users
                    WHERE id = ${req.body.id}
                `})
                res.json(await this.getUsers())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        /* Users Permissions  */

        app.get('/api/premission/get', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.getPremissions();
                res.json(resutls)
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/premission/save', [this.jwtMiddleware.authCall], async (req, res) => {
            try{
                if(req.body.id) {
                    let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        UPDATE .map_topics
                        SET 
                            userId = ${req.body.uId},
                            topicId = ${req.body.tId}
                        WHERE id = ${req.body.id}
                    `})
                }else{
                    await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                        insert into .map_topics (userId,topicId)
                        values(${req.body.uId},${req.body.tId});
                `})
                }
                res.json(await this.getPremissions())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });

        app.post('/api/premission/delete', [this.jwtMiddleware.authCall], async (req, res, next) => {
            try{
                let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                    DELETE FROM  .map_topics
                    WHERE id = ${req.body.id}
                `})
                res.json(await this.getPremissions())
            }
            catch(e) {
                console.error(JSON.stringify(e))
                throw new Error(e);
            }
        });
    }


    private getEnvierments = async () => {
            let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
                SELECT id, envName, props
                FROM .dim_envierments;
            `})
        return resutls.results.map((x)=> {
            return  {id:x.id,envName:x.envName,props:JSON.parse(x.props)}})
    }

    private getTopics = async () => {
        let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
        SELECT t.id, t.envId,e.envName, t.topicName
        FROM dim_topics t
            inner join dim_envierments  e on e.id = t.envId;
        `})
    return resutls.results.map((x)=> {
        return  {id:x.id,envId:x.envId,envName:x.envName,topicName:x.topicName}})
    }

    private getUsers = async() => {
        let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
            SELECT t.id, t.email, t.isAdmin
            FROM .users t
        `})
    return resutls.results.map((x)=> {
        return  {id:x.id,email:x.email,isAdmin:x.isAdmin}})
    }
      
    private getPremissions = async () => {
       
        let resutls = await this.dbHandler.handle({action:DBAction.executeSQL,payload:`
            select 
            mt.id,
            u.email,t.topicName,e.envName,
            e.id as eId,
            t.id as tId,
            u.id as uId 
            from .map_topics mt
                LEFT join .dim_topics t on t.id = mt.topicId
                LEFT join .dim_envierments e on e.id  = t.envId
                LEFT join .users u on u.id  = mt.userId
         `})

        return resutls.results;
    }
}