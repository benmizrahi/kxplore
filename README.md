## ![alt text](https://raw.githubusercontent.com/benmizrahi/Kxplore/master/app/src/assets/k_logo.png)
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

### Mysql 

### Configuration File
The Kxplore configuration file is a simple JSON file with arguments, you can set the PATH to the config file via the ENV parameter: CONFIG_PATH - the preferred location is /etc/kxplore/env.json

** IMPORTENT - you must create kxplore db in the traget mysql you defined in the configuration **

Configuration Example:
```

{
    "authConfig":{
      "SECRET_KEY":"SECRET_KEY",
      "googleConfig":{
        "clientID":  "YOURE-GOOGLE-CLIENT-ID",
        "clientSecret": "YOURE-GOOGLE-CLIENT-SECRET",
        "passReqToCallback"  : true
      },
      "superuser":{
        "user":"Admin",
        "password":"Admin"
      }
   },
    "mysql":{
      "host":"127.0.0.1", //MYSQL host
      "port":"3307", //MYSQL port
      "user":"kxplore",
      "password":"kxplore",
      "database":"kxplore"
    },
    "kafkaConfig": { 
      "messagePool":100, //how match data will be pulled from kafka each interval 
      "minMessage":20, //min messages that triggers the consumer pool interval
      "intervalMs": "1000", // pool interval in ms
      "poolCount":10
    },
    // If planning to scale up the server - you need to configure redis to comunicate between each node
    "redis-config":{
      "host":"localhost", 
      "port":"6379"
    }
  }


```



### SQL Syntax

The Kxplore tool has a fillter feature that gives the ability to filter and manipulate the stream data in real-time - here we will describe the syntax using the filter:

1. select operators:
 * `\*` - pull all JSON fields
 * `field_name` | `field_name,field_name2` - pull the relevent field from the JSON - you can supply multiple fields with the comma (,) seperator.
 * `"$field_name->new_name"` - renaming a filed name.
 * `"$string_field.indexOf($string_field_2)->output"` - you can set any JavaScript manipulation you want.
2. Where operator: