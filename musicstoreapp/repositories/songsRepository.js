module.exports = {
    mongoClient: null,
    app: null,

    //Definimos una función para inicializar dos variables globales
    init: function (app, mongoClient) {
        //definimos dos variables
        this. mongoClient= mongoClient;
        this.app = app;
    },

    //Otra función asincrona (no puede tener return) para devolver un valor,
    //lo pasa como parametro a la funcion callback
    //Exito: Callback recibe la id de la cancion insertada
    //Error: Callback recibe objeto con mensaje de error
    insertSong: function (song, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'songs';
                const songsCollection = database.collection(collectionName);
                songsCollection.insertOne(song)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    }
};
