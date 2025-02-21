

// 'use client';

// import { useSession, signOut } from 'next-auth/react';
// import Link from 'next/link';
// import { Button } from './ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from './ui/dropdown-menu';
// import { User } from 'lucide-react';

// export default function Navbar() {
 

//   const { data: session } = useSession();
//   const userRole = session?.user?.role; // Extract user role

//   return (
//     <nav className="border-b">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="text-xl font-bold">
//             StockRec
//           </Link>

//           <div className="flex items-center gap-4">
//             <Link href="/portfolios">
//               <Button variant="ghost">Standard Portfolios</Button>
//             </Link>

//             {session ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <User className="h-5 w-5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {userRole === 'admin' ? (
//                     <DropdownMenuItem asChild>
//                       <Link href="/admin">Admin Dashboard</Link>
//                     </DropdownMenuItem>
//                   ) : (
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard">Dashboard</Link>
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuItem onClick={() => signOut( {callbackUrl: "https://72ba-117-207-56-104.ngrok-free.app"})}>
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <div className="flex gap-2">
//                 <Link href="/auth/signin">
//                   <Button variant="ghost">Sign In</Button>
//                 </Link>
//                 <Link href="/auth/signup">
//                   <Button>Sign Up</Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }




// 'use client';

// import { useSession, signOut } from 'next-auth/react';
// import Link from 'next/link';
// import { Button } from './ui/button';
// // import { Spinner } from '@/components/ui/spinner';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from './ui/dropdown-menu';
// import { User } from 'lucide-react';

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const userRole = session?.user?.role; // Extract user role

//   return (
//     <nav className="border-b">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="text-xl font-bold">
//             StockRec
//           </Link>

//           <div className="flex items-center gap-4">
//             <Link href="/portfolios">
//               <Button variant="ghost">Standard Portfolios</Button>
//             </Link>

//             {status === 'loading' ? (
//               // Loading spinner while session data is being fetched
//               <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

//             ) : session ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <User className="h-5 w-5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {userRole === 'admin' ? (
//                     <DropdownMenuItem asChild>
//                       <Link href="/admin">Admin Dashboard</Link>
//                     </DropdownMenuItem>
//                   ) : (
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard">Dashboard</Link>
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuItem onClick={() => signOut({ callbackUrl: "https://72ba-117-207-56-104.ngrok-free.app" })}>
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <div className="flex gap-2">
//                 <Link href="/auth/signin">
//                   <Button variant="ghost">Sign In</Button>
//                 </Link>
//                 <Link href="/auth/signup">
//                   <Button>Sign Up</Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }





"use client"

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
// import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const userRole = session?.user?.role; // Extract user role

  useEffect(() => {
    if (status !== 'loading') {
      setIsSessionLoaded(true);
    }
  }, [status]);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            StockRec
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/portfolios">
              <Button variant="ghost">Standard Portfolios</Button>
            </Link>

            {!isSessionLoaded || status === 'loading' ? (
              <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userRole === 'admin' ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "https://72ba-117-207-56-104.ngrok-free.app" })}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
