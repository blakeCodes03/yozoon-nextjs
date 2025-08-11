import { useSession } from 'next-auth/react';

// const SomeComponent = () => {
//   const { data: session, status } = useSession();

//   if (status === 'loading') {
//     // Optionally render a loading state
//     return <div>Loading...</div>;
//   }

//   if (!session) {
//     // User is not authenticated
//     return <div>Please log in to access this page.</div>;
//   }

//   // User is authenticated
//   return <div>Welcome, {session.user.email}!</div>;
// };
