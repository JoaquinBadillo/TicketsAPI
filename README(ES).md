# Tickets.edu API

API para la autenticación de usuarios en el sistema de Tickets para Fundación por México (Tickets.edu). 

## Tabla de Contenidos
- [Pila Tecnológica](#pila-tecnológica)
- [Uso](#uso)
- [Instalación](#instalación)
- [Variables de Entrono](#variables-de-entrono)
- [Corriendo Localmente](#corriendo-localmente)

## Pila Tecnológica

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![Jest](https://img.shields.io/badge/Jest-1_Test-blue)

## Uso

Para correr el proyecto en tu máquina local, necesitarás [instalar](#instalación) las dependencias, crear una [base de datos de MongoDB](https://www.mongodb.com/) y crear un archivo `.env` para las [variables de entorno](#variables-de-entorno).

### Instalación

Este proyecto utiliza `npm` como gestor de paquetes. Asegúrate de tener npm instalado ejecutando
```console 
npm --version
```

Una vez instalado y confugrado correctamente deberías ver la versión de tu gestor de paquetes `x.y.z`.

Para instalar las dependencias ejecuta
```console
npm i
```
en la raíz de este repositorio (ya que el `package.json` se encuentra ahí).

### Variables de Entrono

Las Variables de Entorno nos permiten compartir este repositorio sin exponer información sensible. Las siguientes variables de entorno deben ser declaradas en un archivo `.env`:
- `PORT`
- `SALT`
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`

**A continuación una breve descripción de ellas**

`PORT` es una variable numérica que define el puerto de conexión al servidor (un puerto de red) en el que corre la API; ten en cuenta que los números de puerto usan 2 bytes y por lo tanto solo puedes elegir números del 0 al $2^{16}$.

`SALT` es el numero de veces que se aplicará sal a las contraseñas de los usuarios para encriptarlas. 

`DATABASE_URL` es la url de conexión que provee MongoDB (si quieres usar MongoDB Atlas asegúrate de cambiar `<password>` para la contraseña de tu usuario de base de datos). 

Finalmente, `ACCESS_TOKEN_SECRET` es usado internamente por el servidor para manejar JSONWebTokens (JWT). Cuando uses este servicio en producción no escribas una contraseña normal en texto plano (no necesitas memorizarla), es preferible usar una librería que retorne una cadena de caracteres aleatoria en el ambiente que prefieras (Python, Node, etc).

### Corriendo Localmente

Si has seguido la guía hasta este punto estás listo para correr este proyecto, ejecuta el siguiente comando en la raíz del repositorio:
```console
npm run dev
```

Verás que el servidor está corriendo.