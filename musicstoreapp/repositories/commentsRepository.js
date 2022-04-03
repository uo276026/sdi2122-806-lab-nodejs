module.exports = {
    mongoClient: null,
    app: null,

    //Definimos una función para inicializar dos variables globales
    init: function (app, mongoClient) {
        //definimos dos variables
        this. mongoClient= mongoClient;
        this.app = app;
    },

    //Devuelve los comentarios correspondientes a una cancion
    getComments: async function () {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            const comments = await commentsCollection.find().toArray();
            return comments;
        } catch (error) {
            throw (error);
        }
    },

    insertComments: function (comment, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'comments';
                const commentsCollection = database.collection(collectionName);
                commentsCollection.insertOne(comment)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    }
};
