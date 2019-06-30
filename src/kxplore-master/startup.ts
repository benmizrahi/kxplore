import { Container } from '@decorators/di';
import {Server} from './server'


const config = require(process.env.CONFIG_PATH)

Container.provide([
    { provide: 'global-config', useValue: config }
  ]);
Container.get<Server>(Server);