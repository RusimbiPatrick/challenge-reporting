const knex = require('../db')

module.exports = {
  findStudentById
}

async function findStudentById (studentID) {
  const dbResponse = await knex('students')
    .where({ id: studentID })
    .first()

  if (dbResponse) {
    const student = { ...dbResponse }
    delete student.password_hash
    return student
  }

  return false
}
