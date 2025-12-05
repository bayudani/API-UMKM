import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import 'dotenv/config'; 

// Import routes
import productsRouter from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// === ROUTES ===
app.use('/api', productsRouter); 

// === ERROR HANDLING ===

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); 
});

// error handler
app.use(function(err, req, res, next) {
  // 1. KITA LOG ERRORNYA KE CONSOLE BIAR KELIATAN
  console.error("🔥 ERROR TERDETEKSI BUND:", err.message);
  console.error(err.stack); // <--- Ini biar stack trace-nya muncul

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
      status: 'error',
      message: err.message,
      // Stack trace cuma muncul kalo mode development
      stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

export default app;