#! /usr/bin/node
const sqlite3 = require('sqlite3').verbose();
const express = require('express');

let db = new sqlite3.Database('mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mydatabase database.\n');
});

const app = express();

// http://localhost:3000/admin
app.get('/', ( req, res ) => {
  db.all('SELECT * FROM movies', [], (err, rows) => {
    if (err) {
      throw err;
    }
    let moviesHTML = '<ul>'
    rows.forEach((row) => {
      moviesHTML+='<li>'
      +(row.Name + "\t" +row.Genre)
      +'</li>';
    });
    moviesHTML+='</ul>'
    const page = '<!DOCTYPE html><html><head><title></title></head><body>'+moviesHTML+'</body></html>'
    res.send(page)
  });
})

// http://localhost:3000/admin
app.get('/admin', ( req, res ) => {
  db.all('SELECT * FROM movies', [], (err, rows) => {
    if (err) {
      throw err;
    }
    let moviesHTML = '<ul>'
    rows.forEach((row) => {
      moviesHTML+='<li>'
      +'<a href="/edit/'+row.ID+'">'+(row.Name + "\t" +row.Genre)+'</a>'
      +'<a href="/delete/'+row.ID+'">delete</a>'
      +'</li>';
    });
    moviesHTML+='</ul>'
    const page = '<!DOCTYPE html><html><head><title></title></head><body>'+moviesHTML+'</body></html>'
    res.send(page)
  });
})

// http://localhost:3000/add?name=<NAME>&genre=<GENRE>
app.get('/add', ( req, res ) => {
  const name = req.query.name
  const genre = req.query.genre
  if(!name){
    res.send('name is required')
    return 
  }
  if(!genre){
    res.send('genre is required')
    return
  }
  db.run('INSERT INTO movies (name, genre) VALUES (?, ?)', [ name, genre ], function(err) {
    if (err) {
      return res.send(err.message);
    }
    // get the last insert id
    res.redirect('/')
  });
})

// localhost:3000/delete/<id>
app.get('/delete/:id', ( req, res ) => {
  const id = req.params.id
  db.run(`DELETE FROM movies WHERE id = ?`, id, function(err) {
    if (err) {
      return res.send(err.message);
    }
    if(this.changes === 0){
      return res.send("I didn't delete anything")
    }
    res.redirect('/')
  });
})

// http://localhost:3000/form
app.get('/form', ( req, res ) => {
  const form = `
  <form action="/add">
    <input type="text" name="name"  placeholder="name"/>
    <input type="text" name="genre" placeholder="genre"/>
    <input type="submit" value="ok"/>
  </form>`
  res.send(form)
})

// http://localhost:3000/edit/<ID>
app.get('/edit/:id', ( req, res ) => {
  const id = req.params.id
  db.get('SELECT * FROM movies WHERE id = ?', id, ( err, movie ) => {
    if(err){
      return res.send(err.message)
    }
    if(!movie){
      return res.send('movie not found')
    }
    const form = `
    <form action="/update/`+id+`">
      <input value="`+movie.Name+`" type="text" name="name"  placeholder="name"/>
      <input value="`+movie.Genre+`" type="text" name="genre" placeholder="genre"/>
      <input type="submit" value="ok"/>
    </form>`
    res.send(form)
  })
})

app.get('/update/:id', ( req, res ) => {
  const id = req.params.id
  const name = req.query.name
  const genre = req.query.genre
  db.run('UPDATE movies SET name = ?, genre = ? WHERE id = ?', [ name, genre, id ], function(err) {
    if (err) {
      return res.send(err.message);
    }
    res.redirect('/edit/'+id)
  });
})

app.listen(3000, ()=>{ console.log('server is listening') })
