require("dotenv").config();
import helmet from 'helmet';
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
var bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
import { errorHandler } from "./middleware/errorMiddleware";

interface UserBasicInfo {
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: UserBasicInfo | null;
    }
  }
}

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({
  origin: '*',
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
app.use('/auth', authRouter);
app.use(errorHandler);

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Api up and running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

start();

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
});

