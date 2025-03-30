const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const db = new sqlite3.Database(path.join(__dirname, 'memory.db'));

db.serialize(() => {
  db.exec(schemaSQL, (err) => {
    if (err) {
      console.error('Error creating database schema:', err);
    } else {
      console.log('Database schema created successfully');
    }
  });
});

db.close();