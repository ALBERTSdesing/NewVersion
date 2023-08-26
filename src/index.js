const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(multer({
    storage,
    limits: { fileSize: 50000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|tiff|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("El archivo debe ser una imagen válida"));
    },
    onFileUploadError: (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Error al subir el archivo: ' + err.message);
        } else {
            console.error('Error al subir el archivo: ' + err);
        }
        // En lugar de alert, maneja el error de acuerdo a tus necesidades
        // Por ejemplo, podrías enviar un mensaje de error al cliente
    }
}).single('images'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(require('./routes/index.routes'));

app.listen(port, () => {
    console.log(`Servidor en el puerto ${port}`);
});
