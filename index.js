// Setting up the express server
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
// Middleware to parse the incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// An array to temporarily hold the posts.
let posts = [];

// Create a route to render the homepage and display all the posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Create a form in the EJS template for post creation
app.get('/create', (req, res) => {
    res.render('create');
});

// Create a posts route to handle the form submission and create a new post
app.post('/create', (req, res) => {
    const { title, content } = req.body;

    // Create a new post object with a unique ID and add it to the posts array
    const newPost = {
        id: uuidv4(), // Generate a unique ID for each post
        title,
        content
    };
    posts.push(newPost);

    // Redirect back to the homepage with the new post added
    res.redirect('/');
});

// Route to show the edit form for a specific post
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
        // Render the edit.ejs with the post data
        res.render('edit', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to handle updating an existing post
app.post('/edit/:id', (req, res) => {
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === req.params.id);

    if (postIndex !== -1) {
        // Update the post data
        posts[postIndex] = { ...posts[postIndex], title, content };
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to handle deleting a specific post
app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id); // Filter out the post by ID
    res.redirect('/'); // Redirect back to the homepage
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
