const knex = require('./db')
const helper = require('./helpers/db')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  const { id } = req.params
  const student = await helper.findStudentById(id)

  if (!student) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'Student not found'
    })
  }

  return res.status(200).json({
    status: 200,
    success: true,
    message: 'Student details',
    data: student
  })
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
