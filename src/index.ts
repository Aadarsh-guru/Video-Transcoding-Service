import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';

// constants declaration
const app = express();
const PORT = Number(process.env.PORT) || 8000;
const httpServer = http.createServer(app);

// middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(morgan('dev'));

// routes imports
import routes from './routes/route';

//routes declaration
app.use("/api/v1", routes);

// initial route
app.get('/', (_, res) => {
    return res.status(200).json({
        message: 'Server is operating smoothly.',
        success: true
    });
});

// listening for queue events
import './services/queue.service';

// listening server
httpServer.listen(PORT, () =>
    console.log(`server is running at http://localhost:${PORT}`)
);