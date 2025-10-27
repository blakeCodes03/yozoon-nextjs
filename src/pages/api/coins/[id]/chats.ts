import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "../../../../generated/prisma";
import prisma from "../../../../lib/prisma";

import multer from "multer";
import path from "path";
import fs from "fs/promises";

// const prisma = new PrismaClient();

// Configure Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // Save files to the "public/uploads" directory
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware to handle Multer uploads
const multerMiddleware = upload.single("media");

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

// Helper function to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id: coinId } = req.query;

  if (typeof coinId !== "string") {
    res.status(400).json({ message: "Invalid coin ID" });
    return;
  }

  if (req.method === "GET") {
    const { limit = 50, offset = 0 } = req.query;

    try {
      const messages = await prisma.chatMessage.findMany({
        where: { coinId },
        orderBy: { createdAt: "asc" },
        skip: parseInt(offset as string, 10),
        take: parseInt(limit as string, 10),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              pictureUrl: true,
            },
          },
        },
      });

      const formattedMessages = messages.map((msg) => ({
        id: msg.id,
        author: msg.userId,
        displayName: msg.user?.username || "Unknown User",
        profileImage: msg.user?.pictureUrl,
        tokenMint: msg.coinId,
        message: msg.message,
        media: msg.media || null,
        timestamp: msg.createdAt.toISOString(),
      }));

      res.status(200).json({ messages: formattedMessages });
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Error fetching chat messages" });
    }
  } else if (req.method === "POST") {
    try {
      // Run Multer middleware to handle file upload
      await runMiddleware(req, res, multerMiddleware);

      const { message, userId } = req.body;

      if (!message || !userId) {
        res.status(400).json({ message: "Missing message or userId" });
        return;
      }

      let mediaUrl = null;

      // If a file was uploaded, set the media URL
      if ((req as any).file) {
        mediaUrl = `/uploads/${(req as any).file.filename}`;
      }

      const newMessage = await prisma.chatMessage.create({
        data: {
          coinId,
          message,
          userId,
          media: mediaUrl,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              pictureUrl: true,
            },
          },
        },
      });

      const formattedMessage = {
        id: newMessage.id,
        author: newMessage.userId,
        displayName: newMessage.user?.username || "Unknown User",
        profileImage: newMessage.user?.pictureUrl,
        tokenMint: newMessage.coinId,
        message: newMessage.message,
        media: newMessage.media || null,
        timestamp: newMessage.createdAt.toISOString(),
      };

      res.status(201).json({ message: formattedMessage });
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Error creating chat message" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}