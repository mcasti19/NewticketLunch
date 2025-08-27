## Sobre la API REST del Comedor

Esta API REST esta desarrollada en **Laravel 12**

- **MYSQL o MariaDB**.
- **Composer**
- **php 8.2^**

## Instruccion para configuración del proyecto.

- **Clonar el Repositorio de GitLab**
    - git clone http://10.22.8.58/developers/api_rest_comedor.git
    - O
    - git clone https://github.com/DevMercal/api_comedor.git
- **Acceder a la carpeta con el siguiente comando:**
    - cd api_rest_comedor
    - O
    - cd api_comedor
- **Instalar todas las dependencias de COMPOSER para el proyecto**
    - composer install
- **Generamos una copia del archivo .env**
    - cp .env.example  .env
- **Ingresamos al archivo .env creado**
    - nano .env
- **Agregamos las credenciales de la base de datos a las siguientes variables**
    - DB_DATABASE
    - DB_USERNAME
    - DB_PASSWORD
- **Creamos las siguientes migraciones de la base de datos, con los siguiente comandos:**
    - php artisan migrate --path=database/migrations/2025_06_23_224511_create_gerencias_table.php
    - php artisan migrate --path=database/migrations/2025_06_23_225446_create_metodo_pagos_table.php
    - php artisan migrate --path=database/migrations/2025_06_24_193930_create_empleados_table.php
- **Una vez creada las migraciones lanzamos el siguiente comando:**
    - php artisan migrate
- **Lanzamos los Seeder para cargar de una PRE-información del sistema**
    - php artisan db:seed
- **Si estas en local, para levantar el proyecto seria el siguiente comando**
    - php artisan serve


## Configuración de proyecto en servidor web. 
- **Primero cumplir los pasos de la primera parte hasta el *Lanzamos los seeder* y luego seguir**

- **Una vez cumplidos los pasos, debemos ejecutar el siguiente comando**
    - sudo chown -R www-data:www-data (Ruta del donde se encontrara el proyecto)
- **Ingresamos al proyecto**
    - cd (ruta del proyecto)
- **Ya dentro del proyecto ejecutamos el siguiente comando**
    - sudo composer install --optimize-autoloader --no-dev
- **Lanzamos el siguiente comando para cambiar los permisos a la carpeta *storage* y la carpeta *bootstrap*.**
    - sudo chmod -R 775 storage bootstrap/cache

## Configuración de APACHE

- **Primero realizamos la instalación de *APACHE* en el sistema operativo.**
    - apt install apache2 -y
- **Luego ejecutamos el siguiente comando para generar un archivo *.conf* para la configuración**
    - sudo nano /etc/apache2/sites-available/tu-proyecto.conf
- **La configuración que lleva el archivo .conf seria la siguiente:**
```
    <VirtualHost *:80>
        ServerName tudominio.com
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/tu-proyecto/public

        <Directory /var/www/tu-proyecto/public>
            AllowOverride All
            Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>
```

