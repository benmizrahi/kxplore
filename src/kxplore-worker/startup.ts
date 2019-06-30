
import {Server} from './server'
import { Container } from '@decorators/di';
require('dotenv').config()

const config = require(process.env.CONFIG_PATH)
Container.provide([
    { provide: 'global-config', useValue: config }
  ]);
Container.get<Server>(Server);