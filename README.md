# msRegistry

A tiny and easy to use microservices registry server with [express](https://expressjs.com/) and [lowdb](https://github.com/typicode/lowdb)

## Getting started

1. clone the repo:
  ```sh
  git clone https://github.com/nfwyst/msRegistry
  ```
2. run at development mode:
  ```sh
  npm start:dev
  ```
3. run at production mode:
  ```sh
  npm start:prod
  ```

## How to use

As server is running at port 3000 by default, you can change this at `config/default.js`. There are three api for manage
your informations of microservices

### register a microservice

This will add a new record of microservice entry by send http request with `PUT` method to `http://localhost:3000/microservice/register/:name/:version/:port`. If the interval between the last request and the latest request is more than 30 seconds. The microservice will be expired,
so this can ensure every microservice is valid.

### delete a microservice

This will delete the record of microservice that matched by send http request with `DELETE` method to `http://localhost:3000/microservice/register/:name/:version/:port`

### query a microservice

This will response a suitable microservice to caller by send http request with `GET` method to `http://localhost:3000/microservice/find/:name/:version`. If there are multiple matches, one will be selected randomly as response, that is a part of the load balancing.

> The name, version, port, refers to the name, version and port of your microservice, you should replace it. In particular, you can just specify
the main or minor number as the version when query a microservice.
