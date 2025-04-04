// src/types/index.d.ts

import { NextApiRequest } from 'next';
import { Express } from 'express';

export interface CustomNextApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}