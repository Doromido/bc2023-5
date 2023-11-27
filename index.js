const http = require("http");
const host = 'localhost';
const port = 8000;
const type = "utf-8";
const fs = require('fs');
const express = require ('express');
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.use(express.json());  //Цей middleware дозволяє Express автоматично парсити тіло запиту у форматі JSON. 
app.use(express.static('static'));  //Цей middleware служить для обслуговування статичних файлів
app.use(bodyParser.raw({ type: 'text/plain' }));  //Цей middleware використовує body-parser для обробки тіла запиту у форматі text/plain. 
app.use(multer().none());  //Цей middleware використовує multer для обробки файлових завантажень.

const path = require('path');
const File = path.join(__dirname, 'notes.json');

if (!fs.existsSync(File)) {
    fs.writeFileSync(File, '[]');
}

app.get('/notes', (request, response) => {
    try {
        // Отримуємо список нотаток з файлу
        const notes = JSON.parse(fs.readFileSync(File, type));

        // Відправляємо список нотаток у вигляді JSON
    //    res.json(notes);
    response.send(notes);
    
    } catch (error) {
        console.error(error);
        response.status(500).send("Couldn't read file properly.");
    }
});




app.get('/UploadForm.html', (request, response) => {
    response.sendFile(__dirname + '/static/UploadForm.html');
  });



  app.post('/upload', (request, response) => {
    // Отримуємо дані з тіла запиту
    const noteName = request.body.note_name;
    const noteText = request.body.note;

    // Отримуємо список нотаток з файлу
    const notes = JSON.parse(fs.readFileSync(File, type));

    // Перевіряємо чи існує нотатка з таким ім'ям
    const existingNote = notes.find(note => note.name === noteName);

    if (existingNote) {
        // Нотатка з таким ім'ям вже існує, повернути статус 400
        response.status(400).send('Bad Request: Note with this name already exists');
    } else {
        // Нотатки з таким ім'ям не існує, додати нову нотатку
        const newNote = {
            name: noteName,
            text: noteText
        };

        // Додаємо нову нотатку до списку
        notes.push(newNote);

        // Зберегаємо оновлений список нотаток у файл
        fs.writeFileSync(File, JSON.stringify(notes), type);

        // Повертаємо статус 201 (Created)
        response.status(201).send('Note created successfully');
    }


    
    app.get('/notes/:noteName', (request, response) => {
        // Отримуємо ім'я нотатки з параметру шляху
        const noteName = request.params.noteName;
    
        // Отримуємо список нотаток з файлу
        const notes = JSON.parse(fs.readFileSync(File, type));
    
        // Знаходимо нотатку за ім'ям
        const requestedNote = notes.find(note => note.name === noteName);
    
        if (requestedNote) {
            // Нотатка знайдена, повернути текст нотатки
            response.send(requestedNote.text);
        } else {
            // Нотатка не знайдена, повернути статус 404 (Not Found)
            response.status(404).send('Not Found: Note with this name does not exist');
        }
    })

        app.put('/notes/:noteName', (request, response) => {
            // Отримуємо ім'я нотатки з параметру шляху
            const noteName = request.params.noteName;
        
            // Отримуємо новий текст нотатки з тіла запиту
            const newText = request.body;
        
            // Отримуємо список нотаток з файлу
            let notes = JSON.parse(fs.readFileSync(File, type));
        
            // Знаходимо індекс нотатки за ім'ям
            const noteIndex = notes.findIndex(note => note.name === noteName);
        
            if (noteIndex !== -1) {
                // Нотатка знайдена, замінити текст
                notes[noteIndex].text = newText;
        
                // Зберегігаємо новлений список нотаток у файл
                fs.writeFileSync(File, JSON.stringify(notes), type);
        
                // Повертаємо статус 200 (OK)
                response.status(200).send('Note updated successfully');
            } else {
                // Нотатка не знайдена, повернути статус 404 (Not Found)
                response.status(404).send('Not Found: Note with this name does not exist');
            }
        });
        
        app.delete('/notes/:noteName', (request, response) => {
            // Отримуємо ім'я нотатки з параметру шляху
            const noteName = request.params.noteName;
        
            // Отримуємо список нотаток з файлу
            let notes = JSON.parse(fs.readFileSync(File, type));
        
            // Знаходимо індекс нотатки за ім'ям
            const noteIndex = notes.findIndex(note => note.name === noteName);
        
            if (noteIndex !== -1) {
                // Нотатка знайдена, видалити її зі списку
                notes.splice(noteIndex, 1);
        
                // Зберігаємо оновлений список нотаток у файл
                fs.writeFileSync(File, JSON.stringify(notes), type);
        
                // Повертаємостатус 200 (OK)
                response.status(200).send('Note deleted successfully');
            } else {
                // Нотатка не знайдена, повернути статус 404 (Not Found)
                response.status(404).send('Not Found: Note with this name does not exist');
            }
    });
});
  
const requestListener = function(request, response) {
    
};

const server = http.createServer(requestListener);
server.listen (port, host, () => {
    console.log (`Server is running on http://${host}:${port}`)
})
