const express = require('express')
const exphbs = require('express-handlebars')
const PORT = 3333
//Importar o módulo conn para as operações com o banco
const pool = require('./db/conn')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Middleware para arquivos estáticos
app.use(express.static('public'))

app.get('/cadastrar', (request, response)=>{
  return response.render('register')
})

app.post('/cadastrar/insertbook', (request, response)=>{
  const {titulo,categoria,descricao,preco,quantidade} = request.body
  const sql = `INSERT INTO livros(??,??,??,??,??) VALUES(?,?,?,?,?)`
  const data = ['titulo','categoria','descricao','preco','quantidade',titulo,categoria,descricao,preco,quantidade]

  pool.query(sql,data,(error,result)=>{
    if(error)console.error(error)

    response.redirect('/')
  })
})

app.get('/livros/:id', (request, response)=>{
  const id = request.params.id

  const sql = `SELECT * FROM livros WHERE ??=?`
  const data = ['id',id]

  pool.query(sql,data,(error,result)=>{
    if(error)console.error(error)

    livro=result[0]

    response.render('details',{livro:livro})
  })
})

app.get('/atualizar/:id', (request, response)=>{
  const id = request.params.id
  
  const sql = `SELECT * FROM livros WHERE ??=?`
  const data = ['id',id]

  pool.query(sql,data,(error,result)=>{
    if(error)console.error(error)

    livro=result[0]

    response.render('update',{livro:livro})
  })
})

app.post('/atualizar/updatebook/:id', (request, response)=>{
  const id = request.params.id

  const {titulo,categoria,descricao,preco,quantidade} = request.body
  const sql = `UPDATE livros SET ??=?, ??=?, ??=?, ??=?, ??=? WHERE ??=?`
  const data = ['titulo',titulo,'categoria',categoria,'descricao',descricao,'preco',preco,'quantidade',quantidade,'id',id]

  pool.query(sql,data,(error,result)=>{
    if(error)console.error(error)

    response.redirect('/')
  })
})

app.get('/deletar/:id', (request, response)=>{
  const id = request.params.id
  
  const sql = `DELETE FROM livros WHERE ??=?`
  const data = ['id',id]

  pool.query(sql,data,(error,result)=>{
    if(error)console.error(error)

    response.redirect('/')
  })
})

app.get('/', (request, response)=>{
  const sql = `SELECT * FROM livros`

  pool.query(sql,(error,result)=>{
    if(error)console.error(error)

    response.render('home',{livros:result})
  })
})

app.listen(PORT, ()=>{
  console.log(`Servidor rodando na porta ${PORT}`)
})

