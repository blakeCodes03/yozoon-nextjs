// src/pages/api/users/update-profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';
import path from 'path';
import fs from 'fs';


interface MulterFile {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Name of the file within the destination */
  filename: string;
  /** Full path to the uploaded file */
  path: string;
  /** Size of the file in bytes */
  size: number;
}

interface NextApiRequestWithFile extends NextApiRequest {
  file?: MulterFile;
}
// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/assets/avatar/',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
});

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('Error in update-profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  },
});

handler.use(upload.single('picture'));

// handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
handler.post(async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username } = req.body;
  const picture = req.file;

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        pictureUrl: picture ? `/assets/avatar/${picture.filename}` : undefined,
      },
    });

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default handler;
