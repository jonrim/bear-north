'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../../db/_db');
require('../../../db/models/box')(db);
var Box = db.model('box');
var Product = db.model('product');

// --- Get all boxes
router.get('/', function(req, res, next) {
  Box.findAll({})
  .then(boxes => res.send(boxes))
  .catch(next);
})

// --- Create new box
// need to ensure user is admin
router.post('/', function(req, res, next) {
  Box.create(req.body)
  .then(box => res.status(201).send(box))
  .catch(next);
})

// --- Get a specific box matching specific criteria
router.post('/match', function(req, res, next) {
  Box.findAll({ where: req.body }) // may need to split out fields specifically
  .then(function(result){
    var query = result[0].dataValues.productList.map(function(val){return {id: val}});
    return Product.findAll({ where: {$or: query} });
  })
  .then(function(products){
    var toSend = products.map(function(product){return product.dataValues});
    res.send(toSend);
  })
  .catch(next);
})

// --- Specific box
// ------ get
router.get('/:id', function (req, res, next) {
  Box.findById(req.params.id)
  .then(function(box) {
    if (!box) throw HttpError(404);
    res.send(box);
  })
  .catch(next);
});

// ------ update
// need to ensure user is admin
router.put('/:id', function (req, res, next) {
  Box.findById(req.params.id)
  .then(function(box) {
    if (!box) throw HttpError(404);
    else return box.update(req.body);
  })
  .then(updatedbox => res.send(updatedbox))
  .catch(next);
});

// ------ delete
// need to ensure user is admin
router.delete('/:id', function (req, res, next) {
  Box.findById(req.params.id) // need to ensure user is admin
  .then(function(box) {
    if (!box) throw HttpError(404);
    else return box.destroy();
  })
  .then(function() {
    res.status(204).end();
  })
  .catch(next);
});
