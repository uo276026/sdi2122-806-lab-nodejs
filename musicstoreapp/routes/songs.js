module.exports = function (app, MongoClient)  {
    app.get("/songs", function (req, res) {
        let songs=[{
            "title":"Blank space",
            "price":"1.2"
        },{
            "title":"See you again",
            "price":"1.1"
        },{
            "title":"Uptown Funk",
            "price":"1.1"
        }];

        let response={
            seller:'Tienda de canciones',
            songs:songs
        };
        res.render("shop.twig", response);
    });

    app.get('/add', function(req, res) {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(response));
    });

    //Tiene que ir antes de /songs/:id porque si lo hacemos al reves, siempre
    //intentemos agregar una cancion, es como si estuvieramos accediendo a la
    //cancion cuyo id=add
    app.get('/songs/add', function (req, res) {
        res.render("add.twig");
    });

    app.get('/songs/:id', function(req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/songs/:kind/:id', function(req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind;
        res.send(response);
    });

    app.post('/songs/add', function (req, res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price
        }
        MongoClient.connect(app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'songs';
                const songsCollection = database.collection(collectionName);
                songsCollection.insertOne(song)
                    .then(result => res.send("canción añadida id: " + result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => res.send("Error al insertar " + err));
            }
        });
    });



    //Responde a cualq peticiones que empieze por promo, no se si va aqui
    app.get('/promo*', function (req, res) {
        res.send('Respuesta al patrón promo*');
    });

    //Responde cualq peticiones que empiece por pro y termine en ar
    app.get('/pro*ar', function (req, res) {
        res.send('Respuesta al patrón pro*ar');
    });
};

