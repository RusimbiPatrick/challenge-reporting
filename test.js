const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('Id validation middleware', async function (t) {
  const url = `${endpoint}/student/kjkdns`
  try {
    const { data } = await jsonist.get(url)
    t.notOk(data.success, 'Should reject invalid ids')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('getStudent', async function (t) {
  const url = `${endpoint}/student/20000`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.deepEqual({
      id: 20000,
      first_name: 'Luigi',
      last_name: 'Smith',
      email: 'Luigi56@gmail.com',
      is_registered: 0,
      is_approved: 0,
      address: '459 Retta Street Apt. 668',
      city: 'Daly City',
      state: 'CA',
      zip: '94070',
      phone: '791.347.9979',
      created: '1628772504550.0',
      last_login: '1628785367888.0',
      ip_address: '232.51.190.184'
    }, data.data, 'Should return the right student')
  } catch (e) {
    t.error(e)
  }
})

tape('student id should be in the database', async function (t) {
  const url = `${endpoint}/student/800000000`
  try {
    const { data, response } = await jsonist.get(url)
    t.isEqual(404, response.statusCode, 'should return a 404 status')
    t.deepEqual({
      status: 404,
      success: false,
      message: 'Student not found'
    }, data, 'should return not found')
  } catch (e) {
    t.error(e)
  }
})

tape('getStudentGradesReport', async function (t) {
  const url = `${endpoint}/student/1/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.deepEqual({
      id: 1,
      first_name: 'Scotty',
      last_name: 'Quigley',
      email: 'Scotty79@hotmail.com',
      is_registered: 1,
      is_approved: 1,
      address: '241 Denesik Knolls Apt. 955',
      city: 'Buffalo',
      state: 'ME',
      zip: '04710',
      phone: '1-503-560-6954',
      created: '1628767983203.0',
      last_login: '1628770445749.0',
      ip_address: '2.137.18.155',
      grades: [
        {
          course: 'Calculus',
          grade: 50
        },
        {
          course: 'Microeconomics',
          grade: 43
        },
        {
          course: 'Statistics',
          grade: 50
        },
        {
          course: 'Astronomy',
          grade: 63
        }
      ]
    }, data.data, 'It should return the students details and a grades report')
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
