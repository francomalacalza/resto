-- INSTALACION E INICIALIZACION
Crear base de datos y establecer conexion:
    # Para la creacion de la base de datos se deben ejecutar las queries incluidas en el archivo 'querys.sql' que se encuentra en la carpeta 'database', o importar mediante el archivo 'database_resto.sql' dentro de la misma carpeta
    # Dentro de la misma carpeta se encuentra el archivo 'config.js', donde podes modificar los parametros de conexion a la base de datos


Correr servidor:
    # Mediante terminal correr el comando 'npm install' para la instalacion de las dependecias necesarias
    # Luego 'node index.js' para iniciar el servidor

-- TESTEO
    # Abrir la coleccion de postman que se encuentra en la carpeta 'docs'
    # Documentacion API 'apidoc.yaml' compatible con Swagger

-- NOTAS
Sobre la base de datos:
    # Al iniciar la base de datos se generaran automaticamente: usuarios, productos y pedidos
    # La base de datos cuenta con un usuario con rol de administrador (username: admin / password: admin)
    # Usuario administrador solo puede crearse mediante base de datos

Sobre postman:
    # Los request propuestos en postman cunetan con ejemplos ejecutables, no hace falta cambiar los datos del body pero si el token en el header