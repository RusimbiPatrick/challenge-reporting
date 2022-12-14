const knex = require('./db')
const helper = require('./helpers/db')
const gradesIndex = require('./cache/index.json')
const statistics = require('./cache/statistics.json')

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
  try {
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
  } catch (e) {
    next(e)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const { id } = req.params
    const student = await helper.findStudentById(id)
    if (!student) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Student not found'
      })
    }

    const partition = gradesIndex[id]
    const grades = require(`./cache/partition/${partition}`)[id]
    const gradesWithDetails = Object.assign(student, { grades: grades })
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Student Grades Report',
      data: gradesWithDetails
    })
  } catch (e) {
    next(e)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'All courses grades report',
      data: JSON.parse(statistics)
    })
  } catch (e) {
    next(e)
  }
}
