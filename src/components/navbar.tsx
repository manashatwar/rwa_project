import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { BarChart3, Landmark, Wallet } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold text-blue-600 flex items-center"
          >
            <Wallet className="h-6 w-6 mr-2" />
            <span>RWA Lending</span>
          </Link>

          {/* Navigation links - only show if space permits */}
          <div className="hidden md:flex ml-10 space-x-8">
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              Solutions
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              Resources
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
