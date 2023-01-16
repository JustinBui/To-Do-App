const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const Task = require('./models/task')

// console.log(process.env.PORT)
mongoose.connect(process.env.DB_URI, { useNewurlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(process.env.PORT)
        console.log('----------------------- Success! Listening on port ' + process.env.PORT + ' -----------------------')
    })
    .catch((err) => console.log(err))

const app = express()
app.set('view engine', 'ejs'); // view engine through ejs (Our new dependency)
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true })) // Takes URL encoded data (Useful for POST requests)

// ----------------------- Routing for GET requests -----------------------
app.get('/', (req, res) => {
    Task.find().sort({createdAt:-1}) // Most recent update goes up top
        .then((result) => {
            res.render('main', { tasks: result, title: 'Main' })
        })
        .catch((error) => {
            console.log(error)
        })
})

app.get('/add-task', (req, res) => {
    res.render('add-task', {title: 'Add Task'})
})
// -----------------------------------------------------------------------

// Post request (i.e when user wants to post a task)
app.post('/task', (req, res) => {
    console.log(req.body)

    const t = new Task(req.body)

    t.save()
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })

})

app.delete('/:_id', (req, res) => {
    console.log(req.params._id)
    Task.findByIdAndDelete(req.params._id)
        .then((result) => {
            res.json( {redirect:'/'} ) // AJAX response to client (Sending JSON with redirect path)
        })
        .catch((error) => {
            console.log(error)
        })
})

app.use((req, res) => {
    res.status(404).render('404', {title: '404'})
})