const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mydatabase database.\n');
});
 
db.run('INSERT INTO movies (name, genre) VALUES (?, ?)', ['Movie', 'Comedy'], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
});


db.run('UPDATE movies SET name = ? WHERE id = ?', ['New Movie', 7], function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes} `);
 
});

db.run(`DELETE FROM movies WHERE name = ?`, 'Deadpool', function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) deleted ${this.changes}`);
});

db.all('SELECT * FROM movies', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.ID + "\t" + row.Name + "\t" +row.Genre);
  });
});



db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('\nClose the database connection.');
});
