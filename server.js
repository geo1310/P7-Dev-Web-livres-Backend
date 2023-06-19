// Serveur HTTP

const http = require('http'); // importe le module fournit les fonctionnalités pour créer un serveur http
const app = require('./app'); // importe le module principal de l'application express
require('dotenv').config();

/**
 * Controle la valeur du port serveur demandé
 * @param {*} val port du serveur
 * @returns {number|false} le port si valide sinon false
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

/**
 * Gestion des erreurs lors du demarrage serveur
 * @param {*} error erreur serveur
 */
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        // si l'erreur n'est pas liée  au listen
        throw error; // lance une exception pour propager l'erreur
    }
    const address = server.address();
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        // acces refusé
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        // adresse deja utilisé
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const port = normalizePort(process.env.PORT || 4000);
app.set('port', port);

const server = http.createServer(app);

// gestionnaire d evenements d ecoute en cas d'erreur
server.on('error', errorHandler);

// gestionnaire d evenements d'ecoute affiche la connexion serveur
server.on('listening', () => {
    const address = server.address();
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// demarrage du serveur
server.listen(port);
