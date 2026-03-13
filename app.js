const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || 'not-configured';

app.use(express.json());

// In-memory data for assignment purpose
let courses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Programming',
    instructor: 'Dr. Sharma',
    credits: 4
  },
  {
    id: 2,
    code: 'CS102',
    title: 'Data Structures',
    instructor: 'Prof. Mehta',
    credits: 3
  },
  {
    id: 3,
    code: 'CS103',
    title: 'Database Systems',
    instructor: 'Dr. Khan',
    credits: 3
  }
];

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Course API is running successfully',
    version: 'v1.1-api',
    database: DB_URL,
    endpoints: {
      health: '/health',
      allCourses: '/api/v1/courses',
      singleCourse: '/api/v1/courses/:id'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    port: PORT
  });
});

// GET all courses
app.get('/api/v1/courses', (req, res) => {
  res.status(200).json({
    count: courses.length,
    data: courses
  });
});

// GET one course by ID
app.get('/api/v1/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  res.status(200).json(course);
});

// POST new course
app.post('/api/v1/courses', (req, res) => {
  const { code, title, instructor, credits } = req.body;

  if (!code || !title || !instructor || credits === undefined) {
    return res.status(400).json({
      message: 'Please provide code, title, instructor, and credits'
    });
  }

  const newCourse = {
    id: courses.length ? courses[courses.length - 1].id + 1 : 1,
    code,
    title,
    instructor,
    credits
  };

  courses.push(newCourse);

  res.status(201).json({
    message: 'Course created successfully',
    data: newCourse
  });
});

// PUT update course
app.put('/api/v1/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { code, title, instructor, credits } = req.body;

  const courseIndex = courses.findIndex(c => c.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courses[courseIndex] = {
    ...courses[courseIndex],
    code: code ?? courses[courseIndex].code,
    title: title ?? courses[courseIndex].title,
    instructor: instructor ?? courses[courseIndex].instructor,
    credits: credits ?? courses[courseIndex].credits
  };

  res.status(200).json({
    message: 'Course updated successfully',
    data: courses[courseIndex]
  });
});

// DELETE course
app.delete('/api/v1/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courses = courses.filter(c => c.id !== id);

  res.status(200).json({
    message: 'Course deleted successfully',
    data: course
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});