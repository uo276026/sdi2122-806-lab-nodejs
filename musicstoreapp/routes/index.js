var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    //redirecciona a shop ya que index no tiene ningun contenido relevante atm
    res.redirect('/shop');
});

module.exports = router;
