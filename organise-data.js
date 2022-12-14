const fs = require('fs/promises')
const fsSync = require('fs')
const grades = require('./grades.json')

const cacheDir = 'cache/'
const partitionsDir = `${cacheDir}partition/`

function mkdir (folderName) {
  try {
    if (!fsSync.existsSync(folderName)) {
      fsSync.mkdirSync(folderName)
    }
  } catch (error) {
    console.log(error)
  }
}

async function rmdir (folderName) {
  try {
    if (fs.stat(folderName)) {
      await fs.unlink(folderName)
    }
  } catch (error) {
    console.log(error)
  }
}

async function writeToFile (file, content) {
  try {
    const data = await JSON.stringify(content)
    await fs.writeFile(file, data)
  } catch (error) {
    console.log(error)
  }
}

mkdir(`${cacheDir}`)
mkdir(`${partitionsDir}`)

function insertIntoMap (map, key, value) {
  if (map[key]) {
    map[key].push(value)
  } else {
    map[key] = [value]
  }
}

function groupGradesByIdAndggregateByCourse (arr) {
  const gradesByStudentId = {}
  const gradesByCourse = {}

  arr.forEach(element => {
    const { id, course, grade } = element
    const courseAndGrade = { course: course, grade: grade }
    insertIntoMap(gradesByStudentId, id, courseAndGrade)
    insertIntoMap(gradesByCourse, course, grade)
  })
  return { gradesByStudentId, gradesByCourse }
}

function sumArray (arr) {
  let sum = 0
  arr.forEach(item => {
    sum += item
  })
  return sum
}

console.log('Generating grades report')
async function generateStatitics () {
  const { gradesByCourse } = groupGradesByIdAndggregateByCourse(grades)
  const stats = {}
  for (const key of Object.keys(gradesByCourse)) {
    const sorted = gradesByCourse[key].sort()
    const length = sorted.length
    const min = sorted[0]
    const max = sorted[length - 1]
    const average = sumArray(sorted) / length
    const summary = { min: min, max: max, average: average.toPrecision(4) }
    stats[key] = summary
  }
  await writeToFile(`${cacheDir}statistics.json`, JSON.stringify(stats))
}

generateStatitics()

console.log('Creating partitions and indexes')
async function createPartitionsAndIndex () {
  const { gradesByStudentId } = groupGradesByIdAndggregateByCourse(grades)
  const index = {}
  let partialData = {}
  let partition = 1
  let count = 0

  for (const key of Object.keys(gradesByStudentId)) {
    partialData[key] = gradesByStudentId[key]
    index[key] = partition
    if (count > 5000) {
      await writeToFile(`${partitionsDir}${partition}.json`, partialData)
      partition = partition + 1
      count = 0
      partialData = {}
    } else if (key === '100000') {
      // residue data
      await writeToFile(`${partitionsDir}${partition}.json`, partialData)
    }
    count = count + 1
  }
  await writeToFile(`${cacheDir}index.json`, index)
}

createPartitionsAndIndex()

console.log('cleaup unused file(grades.json)')
rmdir('./grades.json')
