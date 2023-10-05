const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Données de test pour les livres 
let books = [
    { id: 1, titre: 'React Js for Biginner part 1', auteur: 'Mac 1', date_publication: '2022-01-01' },
    { id: 2, titre: 'Père riche vol 2', auteur: 'Max 2', date_publication: '2022-02-01' },
    { id: 3, titre: 'Gachette', auteur: 'Louis 3', date_publication: '2022-03-01' }
];

// welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome." });
});

// Récupérer tous les livres
app.get('/livres', (req, res) => {
    res.json(books);
})

// Récupérer un livre par son ID
app.get('/livres/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(book => book.id === bookId);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Livre non trouvé' });
    }
});

// Ajouter un nouveau livre
app.post('/livres', (req, res) => {
    const newBook = req.body;
    newBook.id = books.length + 1;
    books.push(newBook);

    res.status(201).json(newBook);
});

// Mettre à jour un livre existant
app.put('/livres/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const updatedBook = req.body;

    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...updatedBook };
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: 'Livre non trouvé' });
    }
});


// Supprimer un livre
app.delete('/livres/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    books = books.filter(book => book.id !== bookId);

    res.sendStatus(204);
});

// gestion d'erreur interne 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});


const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});