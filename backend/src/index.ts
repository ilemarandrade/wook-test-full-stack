import express from 'express';
import cors from 'cors';
import v1RouterAuth from './v1/routes/auth.js';
import { transporter } from './utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8081;

// verify connection configuration
transporter.verify(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// *** call to version 1 routes ***
app.use('/api/v1/auth', v1RouterAuth);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
