// // src/pages/api/leaderboard/index.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     try {
//       // Example: Fetch top 10 users based on reputation score
//       const topUsers = await prisma.user.findMany({
//         orderBy: {
//           reputation: {
//             score: 'desc',
//           },
//         },
//         take: 10,
//         select: {
//           username: true,
//           reputation: {
//             select: {
//               score: true,
//             },
//           },
//         },
//       });

//       const leaderboard = topUsers.map((user: { username: string; reputation?: { score: number } }) => ({
//         user: user.username,
//         score: user.reputation?.score || 0,
//       }));

//       res.status(200).json(leaderboard);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching leaderboard' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
