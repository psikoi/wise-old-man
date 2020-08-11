import { NextFunction, Request, Response } from 'express';
import * as nameService from 'api/services/internal/names';
import * as playerService from 'api/services/internal/players';
import * as pagination from 'api/util/pagination';

// GET /names
async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset } = req.query;
    const status = req.query.status ? parseInt(req.query.status as string) : null;

    const paginationConfig = pagination.getPaginationConfig(limit, offset);
    const results = await nameService.getList(status, paginationConfig);

    res.json(results);
  } catch (e) {
    next(e);
  }
}

// POST /names
async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const oldName = playerService.standardize(req.body.oldName);
    const newName = playerService.standardize(req.body.newName);

    const nameChangeRequest = await nameService.submit(oldName, newName);

    res.status(201).json(nameChangeRequest);
  } catch (e) {
    next(e);
  }
}

// GET /names/:id
async function details(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const nameChangeDetails = await nameService.getDetails(id);

    res.json(nameChangeDetails);
  } catch (e) {
    next(e);
  }
}

// POST /names/:id/approve
async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const adminPassword = req.body.adminPassword;

    const nameChangeRequest = await nameService.approve(id, adminPassword);

    res.json(nameChangeRequest);
  } catch (e) {
    next(e);
  }
}

// POST /names/:id/deny
async function deny(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const adminPassword = req.body.adminPassword;

    const nameChangeRequest = await nameService.deny(id, adminPassword);

    res.json(nameChangeRequest);
  } catch (e) {
    next(e);
  }
}

export { index, submit, details, approve, deny };
