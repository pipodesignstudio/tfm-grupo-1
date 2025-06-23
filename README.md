# Nido: Pasos para ejecutar la aplicación

## Paso 1: Levantar base de datos con Docker

### En el directorio raíz del proyecto

```bash
docker compose up -d
```

### En el caso de que ya tengas una imagen creada y haya que resetearla

```bash
docker compose down -v
```

Posteriormente repetir el paso 1

#### Troubleshooting

Existe la posibilidad de que tengas los cuerpos por defecto de MySQL y MongoDB ocupados por alguna práctica anterior. En tal caso, deberás remapear los puertos a otro puerto disponible.

Ejemplo: en la línea 10 del docker-compose.yml

```yaml
ports:
  - "3307:3306"
```

Nota: deberás ajustar a este puerto todas las referencias en el archivo .env

## Paso 2: Copnfigurar backend

### 2.1 Entrar en backend

``` bash
cd backend
```

### 2.2 Instalar dependencias


``` bash
npm i

```

#### Troubleshooting

En ocasiones algunas dependencias no se actualizan correctamente en el package.json. En caso de que te falte algún módulo instálalo manualmente con npm install <modulo>

### 2.3 En caso de que no exista .env crear archivo:

``` env
# backend/.env

```

En caso de que exista .env.development renombrar archivo y ajustar las variables.

### 2.4 Sincronizar Prisma

``` bash
npx prisma db pull // Sincroniza la base de datos con el esquema de prisma
npx prisma generate // Genera el cliente de prisma
npx prisma studio // Abre el studio de prisma para que puedas ver la BBDD
```

### 2.5 Levantar el servidor en modo desarrollo

``` bash
npm run start:dev

```

Si todo va bien deberías ver un mensaje como el siguiente:

``` bash
✅ Conectado a la base de datos MySQL (Prisma)
✅ Conectado a la base de datos MongoDB (Mongoose)
🚀 Servidor arrancado en el puerto: 3000
```

En caso de errores, depurar. Lo más habitual es que sea un error de sintaxis entre alguna modificación de los modelos de prisma y las interfaces que devuelve la aplicación o la falta de alguna de las dependencias.

### 2.6 Documentación

Con el servidor corriendo visita http://localhost:3000/api-docs

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