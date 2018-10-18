import { IHandler } from "../interfaces/IHandler";
import { DBAction, LoggerAction, DBTables } from "../interfaces/enums";

export class User {
   
    id:string;
    admin:boolean;
    imageUrl:string;
    displayName:string;
    envs:{ [env:string]:Array<string> };
    password:string;
    sessionToken:string;


    static getUserIdByEmail = async (email,dbHanlder:IHandler<DBAction>) => {
        let res = await dbHanlder.handle({action:DBAction.executeSQL,payload:
            `SELECT id,password from users where email = '${email}'`})
        return res.results.length > 0 ? {id:res.results[0].id,password:res.results[0].password}  : null
    }

    static buildUserObjectById = async (id,dbHanlder:IHandler<DBAction>,profile?):Promise<User>=>{
       if(profile){
        let imageUrl = '';
        if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
        }
        let update_profile =  await dbHanlder.handle({action:DBAction.executeSQL,payload:`INSERT INTO users_profile (authId,displayName,image,userId)
            VALUES("${profile.id}", "${profile.displayName}", "${imageUrl}",${id}) ON DUPLICATE KEY UPDATE    
                    authId="${profile.id}", displayName="${profile.displayName}",image = "${imageUrl}"`});
        
        console.log(`profile update status: ${update_profile.status}`)
      }

      let profile_res = await dbHanlder.handle({action:DBAction.executeSQL,payload:
                `SELECT u.id,u.isAdmin,u.email,up.displayName,up.image,e.envName,t.topicName
                from users u
                LEFT JOIN users_profile up on u.id = up.userId
                LEFT JOIN map_topics mt on mt.userId = u.id
                LEFT JOIN dim_topics t on t.id = mt.topicId
                LEFT JOIN dim_envierments e on e.id = t.envId
                where u.id = ${id}`})
        
        let u = new User()
        let envs = {}
        profile_res.results.forEach(row => {
            if(!row.envName) return;
           if(!envs[row.envName]) envs[row.envName] = []
           envs[row.envName].push(row.topicName)
        });
        u.admin = profile_res.results[0].isAdmin
        u.envs = envs;
        u.displayName = profile_res.results[0].displayName ||  profile_res.results[0].email
        u.imageUrl = profile_res.results[0].image
        console.log(`fatch user ${JSON.stringify(u)}`);
        return u;

    }
    
    static createAdminUser = async (user,password,dbHanlder) =>{
            let res = await dbHanlder.handle({action:DBAction.executeSQL,
                payload:`
                            insert into .users (email,isAdmin,password)
                            values('${user}',1,'${password}')
                            ON DUPLICATE KEY UPDATE email='${user}', password='${password}';
                        `})

            console.log(` superuser created!`)
    }
}