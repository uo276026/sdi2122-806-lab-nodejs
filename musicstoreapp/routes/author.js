module.exports = function(app) {

    app.get("/authors", function (req, res) {
        let authors=[{
            "name":"Tyler",
            "group":"Twenty One Pilots",
            "rol":"Cantante"
        },{
            "name":"Freddie Mercury",
            "group":"Queen",
            "rol":"Teclista"
        },{
            "name":"John Lennon",
            "group":"The Beatles",
            "rol":"Guitarrista"
        }];

        let response={
            seller:'Tienda de canciones',
            authors:authors
        };
        res.render("author/authors.twig", response);
    });


    app.get('/authors/add', function (req, res) {
        res.render("author/add.twig");
    });

    app.post('/authors/add', function(req,res){
        let response = "";
        if(req.body.name!=null && typeof(req.body.name)!="undefined"){
            response="Nombre de autor:" + req.body.name + "<br>";
        } else{
            response="Nombre de autor no enviado en la petición"+ "<br>";
        }
        if(req.body.group!=null && typeof(req.body.group)!="undefined"){
            response+="Grupo:" + req.body.group + "<br>";
        } else{
            response+="Grupo no enviado en la petición"+ "<br>";
        }
        if(req.body.rol!=null && typeof(req.body.rol)!="undefined"){
            response+="Rol:" + req.body.rol + "<br>";
        } else{
            response+="Rol no enviado en la petición"+ "<br>";
        }
        res.send(response);
    });

    app.get('/authors*', function (req, res) {
        res.redirect("/authors");
    });
    app.get('/*authors', function (req, res) {
        res.redirect("/authors");
    });




};

