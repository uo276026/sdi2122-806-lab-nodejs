module.exports = {
    mongoClient: null,
    app: null,

    //Definimos una función para inicializar dos variables globales
    init: function (app, mongoClient) {
        //definimos dos variables
        this.mongoClient= mongoClient;
        this.app = app;
    },
    deleteSong: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const result = await songsCollection.deleteOne(filter, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    updateSong: async function(newSong, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const result = await songsCollection.updateOne(filter, {$set: newSong}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },

    //Función que devuelve todos los doscumentos en "songs" mediante find()
    //Si no establecemos filtro en find(), devuelve todas
    //El resultado lo transformamos en array
    getSongs: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const songs = await songsCollection.find(filter, options).toArray();
            return songs;
        } catch (error) {
            throw (error);
        }
    },

    //funcion encargada de devolver una unica cancion en base a un filtro y unas opciones
    findSong: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const song = await songsCollection.findOne(filter, options);
            return song;
        } catch (error) {
            throw (error);
        }
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
