const { Router } = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/upload', (req, res) => {
    const { filename } = req.file;
    const inputImagePath = path.join(__dirname, '../public/uploads', filename);
    const selectedFormat = req.body.format;
    const outputFilename = `${filename.split('.')[0]}_converted.${selectedFormat}`;
    const outputImagePath = path.join(__dirname, '../public/uploads', outputFilename);

    sharp(inputImagePath)
        .toFormat(selectedFormat)
        .toBuffer((err, buffer) => {
            if (err) {
                console.error(err);
                const errorMessage = 'Error al convertir la imagen';
                res.status(500).json({ error: errorMessage });
                return;
            }

            res.set('Content-Disposition', `attachment; filename=converted.${selectedFormat}`);
            res.send(buffer);

            fs.unlink(inputImagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(unlinkErr);
                }
            });
            fs.unlink(outputImagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(unlinkErr);
                }
            });
        });
});

module.exports = router;
