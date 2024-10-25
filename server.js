const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle connection with Socket.IO
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for audio data event from client
    socket.on('audioData', (audioBuffer) => {
        const rawFilePath = `raw_audio_${Date.now()}.wav`; // Save initially as a raw file (WAV)
        const mp3FilePath = `audio_${Date.now()}.mp3`;

        // Save the audio buffer as a raw WAV file first
        fs.writeFile(rawFilePath, Buffer.from(audioBuffer), (err) => {
            if (err) {
                console.error("Error saving raw audio file:", err);
                return;
            }
            console.log(audioBuffer);

            console.log("Raw audio file saved:", rawFilePath);

            // Convert the raw file to MP3 using ffmpeg
            ffmpeg(rawFilePath)
                .toFormat('mp3')
                .on('end', () => {
                    console.log("Audio successfully converted to MP3:", mp3FilePath);

                    // Optionally, delete the raw file after conversion
                    // fs.unlink(rawFilePath, (err) => {
                    //     if (err) console.error("Error deleting raw file:", err);
                    //     else console.log("Raw file deleted after MP3 conversion");
                    // });
                })
                .on('error', (err) => {
                    console.error("Error converting to MP3:", err);
                })
                .save(mp3FilePath);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
