## Kxplore - explore Kafka messages in a different way
## Montivation
Our mission is to create a simple and stable tool that can give us the ability to explore data in our Kafka topics - Kxplore containes is a UI layer over Kafka consumer that gives powefull tools over you're Kafka cluster.
This product was born after we were seeking for a Kafka management tool that can give also a gimes of the

### Features Included
 - SQL Like syntax for filter messages
 - Javascript expression handling to apply transformation over Kafka Messages 
 - Export messages to JSON, CSV files.
 - Charts view over Data stream

### Getting Started

1. Build from source 
2. Docker container 

#### 1. Build From Source

#####  Prerequisite
- Angular-cli v6.0.x / above
- Nodejs v8.11.x / above
- Typescript 2.9.x / above

##### Building The Source Files:
To get started clone the repository to you're own envierment:

`
git clone https://github.com/benmizrahi/Kxplore.git
cd Kxplore/
`

Install client & server dependencies - the project contains both client (Angular 6) and server (Nodejs)

``
npm run build 
``

Build Angular App this command uses ng-cli to compile all client assets and copy sources to the public express folder

`
npm run build:prod:app
`

After this command you should see a dist folder on the root project folder - this folder contains all the Angular build sources that the Express app serves.

Complie all server Typescript files:

`
tsc .
`

The server startup.js takes two envierment varaibles:
1. CONFIG_PATH - you're local path to the configuration file (see config explantion)
2. BASE_DOMAIN_URL - the base domain name (in local mode set to localhost:3000).

Running the app execute example:

``
CONFIG_PATH=/path/to/env.json BASE_DOMAIN_URL=http://localhost:3000 node startup.js
``

Now you can browse the app in http://localhost:3000/

#### 2. Docker Container

The Kxplore project can run also via docker container - to run via docker just pull the image to you're local by running the following:

`
docker pull benmizrahi/kxplore
`

Running the container:

``
docker run -p 3000:3000 -e "CONFIG_PATH=/path/to/env.json" -e "BASE_DOMAIN_URL=http://localhost:4000" kxplore
``


Now you can browse the app in http://localhost:3000/

### Configuration File
...

### SQL Syntax
