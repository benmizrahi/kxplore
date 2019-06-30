import {Server} from './server'
import { Container } from '@decorators/di';
require('dotenv').config()


const config = require(process.env.CONFIG_PATH)
console.log(`config loaded from ${process.env.CONFIG_PATH}`)

config.loginRedirect = process.env.BASE_DOMAIN_URL
config.authConfig.googleConfig.callbackURL =  process.env.BASE_DOMAIN_URL + "/auth/google/callback",
Container.provide([
    { provide: 'global-config', useValue: config }
  ]);
Container.get<Server>(Server);