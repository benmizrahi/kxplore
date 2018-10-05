import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../dataModels/user';
import { Injectable, Inject } from '@decorators/di';
import { IHandler } from '../interfaces/IHandler';
import { LoggerAction, DBAction } from '../interfaces/enums';
import { JWTAuthMiddleware } from '../middlewares/jwt-auth-middleware';
import { IDbHandler } from '../handlers/dbHandler';
import { ILoggerHandler } from '../handlers/loggerHandler';
const passport  = require( 'passport');

@Injectable()
export class AuthenticationRouter{
 
  private googleStrategy = require( 'passport-google-oauth2' ).Strategy;

  constructor(
    @Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>,
    @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
    @Inject(JWTAuthMiddleware) private readonly jwtMiddleware: JWTAuthMiddleware,
    @Inject('global-config') private readonly config:any){
  }

  register = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new this.googleStrategy(this.config.authConfig.googleConfig,
     async (request, accessToken, refreshToken, profile, done) => {
        let userId = await User.getUserIdByEmail(profile.email,this.dbHandler);
        if(!userId) {
          done(null,`UnAuthoraized`)
          return;
        }
        const token = jwt.sign(userId, this.config.authConfig.SECRET_KEY);
        let user = await User.buildUserObjectById(userId,this.dbHandler,profile);
        user.token = token;
        done(null, user);
      }
    ));

    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    this.initRouter(app,this.config);
  }


  private initRouter = (app:express,config:any) => {

    app.get('/auth/google',
      passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
      ));

    app.get( '/auth/google/callback',
      passport.authenticate('google', {
        failureRedirect:  config['loginRedirect'] + '/login'
      }),(req,res)=>{
        if(req.user !== "UnAuthoraized"){
         res.redirect(config['loginRedirect'] + "/?access_token=" + req.user.token);
        }else{
          res.redirect(config['loginRedirect'] + "/login?UnAuthoraized");
        }
      });


    app.get('/auth/login',(req, res, next) => {
        if (req.query.return) {
          req.session.oauth2return = req.query.return;
        }
        next();
      },
      passport.authenticate('google', { scope: ['email', 'profile'] })
    );


    app.get('/profile',this.jwtMiddleware.authCall,async (req,res)=>{
       let user = await User.buildUserObjectById(req['__decoded_token'],this.dbHandler);
        res.send(user);
    });

  };

  private extractProfile (profile,token):User {
    
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
      imageUrl = profile.photos[0].value;
    }

    let userEntity = new User();
    userEntity.id = profile.id
    userEntity.displayName = profile.displayName
    userEntity.imageUrl = imageUrl
    userEntity.token = token
    return userEntity
  }
}
