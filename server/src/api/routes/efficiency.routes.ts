import { Router } from 'express';
import * as controller from '../controllers/efficiency.controller';

const api = Router();

api.get('/leaderboard', controller.leaderboard);

export default api;
