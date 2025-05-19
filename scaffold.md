# Pasos para crear scaffold

## 1. Creación de entornos

```bash 
mkdir backend frontend db

```

## 2. Crear proyecto Angular 

Usar flag directory para evitar crear una carpeta más dentro de frontend. Lo corremos con npx en vez del clásico ng new para evitar que pueda haber conflictos por las versiones de cada equipo local (aunque se supone que en el máster todos tenemos la 19). Importante skip git para que el CLI de Angular no inicialice un repo que se pise con el de la carpeta raíz

```bash
cd frontend
npx @angular/cli@19 new todoapp --directory . --style=css --routing --skip-git

```

## 3. Crear Express en Backend

```bash
# Asumiendo que nos hemos quedado en frontend en el paso anterior. Ir a la carpeta raíz en cualquier caso

cd ../backend

npm init -y
npm install express
# Para manejar Express con TS
npm install -D typescript ts-node-dev @types/express @types/node
# OJO: esta línea arranca el tsconfig para no tener que configurar nada 
npx tsc --init

```

### 3.1 Código mínimo para app de servidor

- Crear directorios: (👋 NOTA: touch solo funciona en equipo de tipo unix, usar explorador de archivos de vscode como alternativa)

```bash
mkdir src
touch src/index.ts

```

- En index.ts 

```ts

import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hola mundo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor arrancado en el puerto: ${PORT}`));

```

- En packaje.json

Para asegurarnos de que el servidor se pueda ejecutar en pruebas con npm run start:dev

```json
"scripts": {
  "start:dev": "ts-node-dev src/index.ts"
}


```

## 4. DB

La idea es crear los archivos de schema y de seed que ejecutará Docker al levantar la BBDD para que todos tengamos las mismas tablas e información a la hora de trabajar

```bash
# Asumiendo que seguimos en backend
cd ../db
touch schema.sql seed.sql

```

- En schema.sql: es importante que la db se cree en utf para poder meter tildes

```sql
ALTER DATABASE todoapp CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


```

### 4.1 Docker 

```bash

cd ..
touch docker-compose.yml

```

```yml

version: '3.8'

services:
  db:
    image: mysql:latest
    container_name: todoapp_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: todoapp
    ports:
      - "3306:3306"
    volumes:
      - ./db/schema.sql:/docker-entrypoint-initdb.d/1_schema.sql
      - ./db/seed.sql:/docker-entrypoint-initdb.d/2_seed.sql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

```


## Opcional (normalmente .env queda fuera del seguimiento de versiones de github y este archivo nos quita trabajo). Dejar hecho el env del backend con la cadena de conexión mysql

```bash

cd backend
touch .env.development

```

```env

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=todoapp
PORT=3000


```



