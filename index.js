"use strict";
const fs = require('fs');

const getMemory = setInterval(() => {
    console.log((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), 'mb');
}, 100);
getMemory.unref();

getStatistics('input.txt');
function getStatistics(filePath) {

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const getContent = function() {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };

    const generateLettersFile = function(data) {
        return new Promise((resolve, reject) => {

            let alphabetPromises = alphabet.reduce((result, letter) => {
                return getLetterPromise(data.toString(), letter, result);
            }, []);

            Promise.all(alphabetPromises)
                .then((output_summary) => resolve(output_summary))
                .catch((err) => reject(err));
        });
    };

    const writeSummaryFile = function (output_summary) {
        return new Promise((resolve, reject) => {

            console.log('All letters completed. Total letters processed: ' + output_summary.length);
            fs.open('output_summary.txt', 'w', (err, fd) => {

                console.log('Write data to file: output_summary.txt');
                if (err) reject(err);

                fs.write(fd, output_summary.join('\n'), (err) => {
                    if (err) reject(err);
                    console.log('Data was written to file: output_summary.txt');
                })
            });
        });
    };

    return getContent()
        .then(generateLettersFile)
        .then(writeSummaryFile)
        .catch((err) => console.log(err));
}

function getLetterPromise(data, letter, arrayOfPromises) {
    arrayOfPromises.push( new Promise((resolve, reject) => {
        console.log('Start letter', letter);

        let fileName = 'output_' + letter + '.txt';
        let positions = getPositions(data, letter);

        fs.open(fileName, 'w', (err, fd) => {

            if (err) reject(err);
            console.log('Write data to file', fileName);

            fs.write(fd, positions.toString(), (err) => {
                if (err) reject(err);
                console.log('Data was written to file:', fileName);
                resolve(letter + '=' + positions.length);
            });
        });

        console.log('Letter ' + letter + ' completed');

    }));
    return arrayOfPromises;
}

function getPositions(data, letter){

    let positions = [];
    let currentPosition = -1;

    while (true) {
        let i = data.indexOf(letter, currentPosition + 1);
        if (i < 0) break;
        else {
            currentPosition = i;
            positions.push(i);
        }
    }
    return positions;
}