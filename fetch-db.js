const fs = require('fs')
const request = require('request')
request('https://outlier-coding-test-data.onrender.com/students.db')
  .pipe(fs.createWriteStream('students.db'))
console.log('Fetching students.db...')

request('https://outlier-coding-test-data.onrender.com/grades.json')
  .pipe(fs.createWriteStream('grades.json'))
console.log('Fetching grades')
