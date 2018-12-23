import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../dataModels/user';
import { Injectable, Inject } from '@decorators/di';
import { IHandler } from '../interfaces/IHandler';
import { LoggerAction, DBAction } from '../interfaces/enums';
import { JWTAuthMiddleware } from '../middlewares/jwt-auth-middleware';
import { IDbHandler } from '../handlers/dbHandler';
import { ILoggerHandler } from '../handlers/loggerHandler';
const googleStrategy = require( 'passport-google-oauth2' ).Strategy;
const localStrategy = require('passport-local').Strategy;
const passport  = require( 'passport');

@Injectable()
export class AuthenticationRouter{

  constructor(
    @Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>,
    @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
    @Inject(JWTAuthMiddleware) private readonly jwtMiddleware: JWTAuthMiddleware,
    @Inject('global-config') private readonly config:any){
      
      try {
      User.createAdminUser(config.authConfig.superuser.user,jwt.sign(
        config.authConfig.superuser.password, this.config.authConfig.SECRET_KEY),dbHandler);
      }
      catch(ex){
          console.log(`unable to create superuser!`)
      }
  }

  register = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new googleStrategy(this.config.authConfig.googleConfig,
     async (request, accessToken, refreshToken, profile, done) => {
        let userId = await User.getUserIdByEmail(profile.email,this.dbHandler);
        if(!userId) {
          done(null,`UnAuthoraized`)
          return;
        }
        const token = jwt.sign(userId.id, this.config.authConfig.SECRET_KEY);
        let user = await User.buildUserObjectById(userId.id,this.dbHandler,profile);
        user.sessionToken = token;
        done(null, user);
      }
    ));

    passport.use(new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },(username, password,done) => {
          User.getUserIdByEmail(username,this.dbHandler).then((user:any) =>{
          if(!user) return done(null, false);
          if (!this.verifyPassword(password,user)) { return done(null, false); }
          const token = jwt.sign(user.id, this.config.authConfig.SECRET_KEY);
          user.sessionToken = token
          return done(null, user);
      }).catch(e=>{
        return done(e)
      });
  }));

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
         res.redirect(config['loginRedirect'] + "/?access_token=" + req.user.sessionToken);
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
      try{
       let user = await User.buildUserObjectById(req['__decoded_token'],this.dbHandler);
        res.send(user);
      }
      catch(e){
        res.status(401).send('Something broke!')
      }
    });

    app.post('/auth/signin', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        res.redirect(config['loginRedirect'] + "/?access_token=" + user.sessionToken);
      })(req, res, next);
    });
  }

  private verifyPassword = (userPassword,dbUser) => {
    const token = jwt.sign(userPassword, this.config.authConfig.SECRET_KEY);
    return dbUser.password === token
  }
}
