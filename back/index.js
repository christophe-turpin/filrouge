const connection = require('./conf');
const express = require('express');
const app = express();
const port = 3001;
const router = express.Router();
const cors = require('cors')
const BodyParser = require('body-parser')

app.use(express.json())
app.use(BodyParser.urlencoded({
    extended: true
}))

app.use(cors())




router.get('/', (req, res) => {
    connection.query('SELECT * from wilders', (err, results) => {
        if (err) throw err
        res.send(results);
    })
});


router.get('/light', (req, res) => {
    connection.query('SELECT firstname, lastname, formation from wilders', (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.get('/order/:id/:or', (req, res) => {
    const ordered = req.params.or
    const label =req.params.id
    connection.query(`SELECT * from wilders ORDER BY ${label} ${ordered}`, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.get('/:searchname', (req, res) => {
    const idSearch = req.params.searchname
    connection.query("SELECT * from wilders WHERE firstname = ?", idSearch, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.get('/formation/:searchform', (req, res) => {
    const idSearch = req.params.searchform
    connection.query('SELECT * from wilders WHERE formation LIKE ?', `%${idSearch}%`, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.get('/startdate/:searchdate', (req, res) => {
    const idSearch = req.params.searchdate
    connection.query('SELECT * from wilders WHERE startdate > ?', idSearch, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});


router.put('/:id', (req, res) => {
    const idWilder = req.params.id
    const formData = req.body
    connection.query('UPDATE wilders set ? WHERE id= ?', [formData, idWilder], (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.put('/:id/finish', (req, res) => {
    const idWilder = req.params.id
    connection.query('UPDATE wilders SET is_student = !is_student WHERE id = ?', idWilder, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.post('/', (req, res) => {
    const formData = req.body
    connection.query('INSERT INTO wilders SET ?', formData, (err, results) => {
        if (err) throw err
        res.send('OK')
    })
})

router.delete('/delete/finish', (req, res) => {
    connection.query('DELETE from wilders WHERE is_student = 0', (err, results) => {
        if (err) throw err
        res.send(results);
    })
});

router.delete('/delete/:id', (req, res) => {
    const idWilder = req.params.id
    connection.query('DELETE from wilders WHERE id = ?', idWilder, (err, results) => {
        if (err) throw err
        res.send(results);
    })
});



app.use('/api/wilders', router)

app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }
    console.log(`Server is listening on ${port}`);
});