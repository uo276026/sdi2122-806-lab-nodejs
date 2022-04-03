const {ObjectId} = require("mongodb");
module.exports = function (app) {

    app.post('/comments/:song_id', function (req, res) {
        let song = {
            author: req.body.author,
            text: req.body.text,
            song_id: req.body.song_id,
        };

    });
}