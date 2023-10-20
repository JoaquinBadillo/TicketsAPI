# Tickets.edu API

Authentication API for Fundación por México's Ticketing System (Tickets.edu)

## Table of Contents
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)

## Tech Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![Jest](https://img.shields.io/badge/Jest-1_Test-blue)

## Usage

To run the project on your local machine you will need to [install](#installation) the dependencies, create a [MongoDB Database](https://www.mongodb.com/) and create a `.env` file for the [environment variables](#environment-variables).

### Installation

This project uses `npm` as the package manager; however you may use the Dockerfile to install in a container.

#### Using Node

Make sure you have npm installed by executing
```console
npm --version
```

If installed and configured properly you should see the version of your package manager `x.y.z`.

To install dependencies execute
```console
npm i
```
at the root of this repository (since the `package.json` is located there).

#### Using Docker

Make sure you have docker installed by executing
```console
docker -v
```

If installed and configured properly you should see the message: `Docker version x.y.z`.

To use docker, you should first build the image and tag it. Inside the root directory of the repository execute
```console
docker build -t ticketsapi .
```

Here we are using `ticketsapi` as the tag, you can give it any other name you prefer. This command might take a while (unless some parts of the Dockerfile are already cached on your system).

### Environment Variables

Environment variables allow us to share this repository without exposing sensible information. The following environment variables must be declared on a `.env` file:
- `PORT`
- `SALT`
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`

**We shall briefly describe each one**

The `PORT` is a numerical variable that defines a connection endpoint to the server (a network port) running the API; beware that port numbers use 2 bytes and thus you can only choose numbers from 0 to $2^{16}$. 

`SALT` is the number of Salt Rounds that will be used to encrypt user passwords. `DATABASE_URL` is the connection url that MongoDB provides (if you want to use MongoDB Atlas make sure to change `<password>` for your database user password). 

Finally the `ACCESS_TOKEN_SECRET` is used internally by the server to manage JSONWebTokens (JWT). When using this service in production do not write a normal plain text secret (you don't need to memorize it), it is prefered to use a library that returns a random string in the environment that you prefer (Python, Node, etc).

### Running Locally

#### Node

If you have followed the Node installation guide and configured the environment variables, you are ready to run this project, execute the following command at the root of the repository:
```console
npm run start
```

If you are a developer and you intend to make changes to the API, we recommend that you use the command 
```console
npm run dev
```

To stop the server execute CTRL + C.

#### Docker

If you decided to build the image using docker and configured the environment variables, you can run the API. Just execute
```console
docker run -p $EXPOSED_PORT:$PORT -d $TAG
```
You must replace $EXPOSED_PORT with the port from which you will access the API and $PORT with the port you established in your environment variables. You must also replace $TAG with the tag you assigned to the docker image (e.g. `ticketsapi`).

If the command is executed properly you will see the containers id displayed.

To stop the server run `docker stop $ID`, where $ID is the id of your container (to check the ID you can execute `docker ps`). You may also use only the first characters of the id, as long as these uniquely identify your container.


### Additional Notes

To start using the API, an administrative user must be added to the database (only administrators will be able to create new users). Future work includes creating this user (if necessary) when starting the server for the first time. The name, email and password for this user will be set in the `.env` file for it to work.
