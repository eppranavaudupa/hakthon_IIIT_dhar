const { exec } = require('child_process');
const path = './audio_1729852876177.mp3';

exec(`python3 transcribe.py ${path}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Transcription: ${stdout}`);
});
