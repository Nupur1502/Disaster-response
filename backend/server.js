const express = require('express');
const cors = require('cors');
const http = require('http'); // ✅ Needed for Socket.IO
const { Server } = require('socket.io');

const disastersRouter = require('./routes/disasters');
const locationRouter = require('./routes/location');
const resourcesRouter = require('./routes/resources');
const reportsRouter = require('./routes/reports');
const socialMediaRouter = require('./routes/socialMedia');
const verificationRouter = require('./routes/verification');
const updatesRouter = require('./routes/updates');
const resourceRoutes = require('./routes/resources');



const app = express();
const server = http.createServer(app); // ✅ Use HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ✅ Make io available inside route handlers
app.set('io', io);

app.use(cors());
app.use(express.json());

// ✅ Health Check
app.get('/test', (req, res) => {
  res.send('✅ Server is running fine.');
});

// ✅ API Routes
app.use('/api/disasters', disastersRouter);
app.use('/api', locationRouter);
app.use('/api/resources', resourcesRouter);
//app.use('/api/reports', reportsRouter);
app.use('/api/disasters', socialMediaRouter);
app.use('/api/disasters', verificationRouter);
//app.use('/api/disasters', updatesRouter);
app.use('/api/disasters', require('./routes/reports'));
app.use('/api/resources', resourceRoutes);


// ✅ WebSocket events
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// ✅ Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
