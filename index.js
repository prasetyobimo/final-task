import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import hbs from 'hbs';
import multer from 'multer'
import path from 'path'
import pkg from 'pg'
const { Pool } = pkg

const app = express();
const port = 2004;

app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use('/assets', express.static('src/assets'));
app.use('/uploads', express.static('src/assets/images/uploads'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia-bro',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// KONEKSI KE DATABASE
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'final_task',
    password: 'bimo',
    port: 5432,
});

hbs.registerHelper('splitLines', function (text) {
  if (!text) return [];
  return text.split(/\n|,/).map(line => line.replace(/^•\s*/, '').trim()).filter(Boolean);
});

// --- KONFIGURASI MULTER (UPLOAD GAMBAR) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/assets/images/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
})
const upload = multer({ storage })

app.get('/', async (req, res) => {
  try {
    const experiences = await pool.query('SELECT * FROM experiences ORDER BY id DESC')
    const projects = await pool.query('SELECT * FROM projects ORDER BY id DESC')

    res.render('portfolio', {
      user: req.session.user,
      experiences: experiences.rows,
      projects: projects.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Database error')
  }
})

// --- POST TAMBAH EXPERIENCES ---
app.post('/experience/add', upload.single('picture'), async (req, res) => {
  if (!req.session.user) return res.redirect('/login')

  const { name, company_name, description, skill } = req.body
  const picture = req.file ? req.file.filename : null

  try {
    await pool.query(
      `INSERT INTO experiences (name, company_name, description, skill, picture)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, company_name, description, skill, picture]
    )
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send('Database insert error')
  }
})

app.post('/experience/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM experiences WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database delete error');
  }
});

// --- POST TAMBAH PROJECT ---
app.post('/project/add', upload.single('image'), async (req, res) => {
  if (!req.session.user) return res.redirect('/login')

  const { name, description, skill } = req.body
  const image = req.file ? req.file.filename : null

  try {
    await pool.query(
      `INSERT INTO projects (name, description, skill, image)
       VALUES ($1, $2, $3, $4)`,
      [name, description, skill, image]
    )
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send('Database insert error')
  }
})

app.post('/project/delete/:id', async (req, res) => {
  const id = req.params.id
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id])
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send('Database delete error')
  }
})
// UPLOAD END ============================================================================

// LOGIN DULUU YAA =======================================================================
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    const user = result.rows[0]

    if (user && user.password === password) {
      req.session.user = user
      res.redirect('/')
    } else {
      res.send('Username atau password salah')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Database error')
  }
})

// LOGOUT DULU YAAAAAA ======================================================================
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
