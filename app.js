import 'dotenv/config';

import express from 'express';
const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ extended: true }));

import helmet from 'helmet';
app.use(helmet());

import { resolve } from 'path';
app.use('/static', express.static(`${resolve()}/static`, { dotfiles: 'allow' }));

app.enable('trust proxy');

import chalk from 'chalk';
app.listen(process.env.PORT || 3000, async (err) => {
    if (err) {
        return console.log(chalk.red(`Error starting the server ❌\n${err}`));
    }
    
    console.log(chalk.green('Server successfully started ✔️'));
});

app.get('/', async (req, res) => {
    return res.status(200).send('Hello, World!');
});

import employeeRoute from './routes/employee.js';
app.use('/employee', employeeRoute);