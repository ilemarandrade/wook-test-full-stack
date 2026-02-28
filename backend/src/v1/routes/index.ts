import express from 'express';
import v1RouterAuth from './auth';
import v1RouterUsers from './users';

const V1Router = express.Router();

V1Router.use('/auth', v1RouterAuth);
V1Router.use('/users', v1RouterUsers);

export default V1Router;
