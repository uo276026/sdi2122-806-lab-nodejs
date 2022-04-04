const {ObjectId} = require("mongodb");
module.exports = function (app, commentRepository) {

    app.post('/comments/:song_id', function (req, res) {
        let comment = {
            author: req.session.user,
            text: req.body.comment,
            song_id: req.params.song_id,
        };
        if(comment.author==null || typeof(comment.author)=="undefined"){
            res.send("Necesitas estar registrado para comentar");
        } else {
            commentRepository.insertComment(comment).then(commentId => {
                res.send('Comentario añadido ' + commentId);
            }).catch(error => {
                res.send("Error al comentar: " + error);
            });
        }
    });

    app.get('/comments/:song_id', function (req, res) {
        res.render("songs/song.twig");
    });

}