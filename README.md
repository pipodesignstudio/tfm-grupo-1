# Todoapp (a falta del nombre definitivo)

## Paso 1: Levantar base de datos con Docker

```bash
docker compose up -d
```

## Paso 2: Copnfigurar backend

### Entrar en backend

``` bash
cd backend
```

### Instalar dependencias


``` bash
npm i

```

### En caso de que no exista .env crear archivo:

``` env
# backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=todoapp
PORT=3000

```

En caso de que exista .env.development renombrar archivo y ajustar las variables

### Levantar el servidor en modo desarrollo

``` bash
npm run start:dev

```

## Paso 3: Levantar el frontend

### Entrar en frontend

``` bash
cd frontend
```
### Instalar dependencias

``` bash
npm i

```

### Levantar el servidor de desarrollo de Angular

``` bash
npx ng serve

```