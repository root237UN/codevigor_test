const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());


// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/livres', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connexion à la base de données réussie');
}).catch((error) => {
    console.error('Erreur de connexion à la base de données', error);
});


// welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome." });
});


// Définition du schéma du livre
const livreSchema = new mongoose.Schema({
    titre: String,
    auteur: String,
    date_publication: Date
});

// Définition du modèle du livre
const Livre = mongoose.model('Libre', livreSchema);

// Récupérer tous les livres
app.get('/livres', (req, res) => {
    Livre.find({}, (err, livres) => {
        if (err) {
            res.status(500).json({ message: 'Erreur interne du serveur', result: err });
        } else {
            res.json(livres);
        }
    });
})

// Récupérer un livre par son ID
app.get('/livres/:id', (req, res) => {
    const livreId = parseInt(req.params.id);

    Livre.findById(livreId, (err, livre) => {
        if (err) {
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } else if (!livre) {
            res.status(404).json({ message: 'Livre non trouvé' });
        } else {
            res.json(livre);
        }
    });
});

// Ajouter un nouveau livre
app.post('/livres', (req, res) => {
    const nouveauLivre = req.body;
    Livre.create(nouveauLivre, (err, livre) => {
        if (err) {
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } else {
            res.status(201).json(livre);
        }
    });
});

// Mettre à jour un livre existant
app.put('/livres/:id', (req, res) => {
    const livreId = parseInt(req.params.id);
    const nouveauLivre = req.body;

    Livre.findByIdAndUpdate(livreId, nouveauLivre, { new: true }, (err, livre) => {
        if (err) {
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } else if (!livre) {
            res.status(404).json({ message: 'Livre non trouvé' });
        } else {
            res.json(livre);
        }
    });
});


// Supprimer un livre
app.delete('/livres/:id', (req, res) => {
    const livreId = parseInt(req.params.id);

    // Supprimer un livre spécifique de la base de données
    Book.findByIdAndRemove(bookId, (err, book) => {
        if (err) {
            res.status(500).json({ message: 'Erreur interne du serveur' });
        } else if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
        } else {
            res.sendStatus(204);
        }
    });
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