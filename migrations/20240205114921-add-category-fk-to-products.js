'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up =  function(db) {
  return db.addForeignKey('products', 'categories', 'product_category_fk',
       {
        "category_id":"id"
      },
       {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
       })
}

exports.down = function(db) {
   db.removeForeignKey("products", "product_category_fk");
}

exports._meta = {
  "version": 1
};
