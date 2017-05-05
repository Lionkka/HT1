"use strict";
const fs = require('fs');

const getMemory = setInterval(()=>{
    console.log((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), 'mb');
}, 100);
getMemory.unref();

getStatistics('input.txt');
function getStatistics(filePath) {

    const alphabet = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');

    function getContent() {
        return new Promise((resolve, reject)=>{
            fs.readFile(filePath, (err, data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    function generateLettersFile(data) {
        return new Promise((resolve, reject)=>{
            data = data.toString();
            let output_summary = [];

            alphabet.forEach((letter, i , arr)=>{
                console.log('Start letter', letter);
                let positions = [];
                let count = 0;
                let currentPosition = -1;
                let fileName = 'output_'+letter + '.txt';
                fs.open(fileName,'w',(err, fd)=>{

                    console.log('Write data to file', fileName);
                    if(err) reject(err);

                    while (true){
                        let i = data.indexOf(letter, currentPosition + 1);
                        if(i < 0) break;
                        else {
                            currentPosition = i;
                            positions.push(i);
                            count++;
                        }
                    }

                    fs.write(fd, positions.toString(),(err)=> {
                        if(err) reject(err);
                        console.log('Data was written to file:', fileName);
                        if(i === arr.length - 1 ){
                            resolve(output_summary);
                        }
                    });
                    output_summary.push(letter + '=' + count);
                });

                console.log('Letter ' + letter +' completed');
            });

        });
    }

    const writeSummaryFile = function (output_summary) {
        return new Promise((resolve, reject)=>{

            console.log('All letters completed. Total letters processed: ' + output_summary.length);

            fs.open('output_summary.txt',  'w' , (err, fd)=>{
                console.log('Write data to file: output_summary.txt');
                if(err) reject(err);
                fs.write(fd,output_summary.join('\n'), (err)=>{
                    if(err) reject(err);
                    console.log('Data was written to file: output_summary.txt');
                })
            });
        });
    };

    return getContent()
        .then(generateLettersFile)
        .then(writeSummaryFile)
        .catch((err)=> console.log(err));
}