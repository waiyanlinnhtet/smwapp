"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils"; 

function MobileNavbar() {
  const [showMobileMenu, setShowMobiileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();

  const profileUsername =
  user?.username ??
  user?.primaryEmailAddress?.emailAddress.split("@")[0];
  
  const navLinkClass = cn(
  buttonVariants({ variant: "ghost" }),
  "flex w-full items-center justify-start gap-3"
);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        <SunIcon className="
            h-[1.2rem] 
            w-[1.2rem] 
            rotate-0 
            scale-100 
            transition-all 
            dark:-rotate-90 
            dark:scale-0
        "/>
        <MoonIcon className="
            absolute 
            h-[1.2rem] 
            w-[1.2rem] 
            rotate-90 
            scale-0 
            transition-all 
            dark:rotate-0 
            dark:scale-100
        "/>
        <span className="sr-only">
            Toggle theme
        </span>
      </Button>

      <Sheet
        open={showMobileMenu}
        onOpenChange={setShowMobiileMenu}
      >
        <SheetTrigger render={
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        }/>

        <SheetContent side="right" className="w-75">
            <SheetHeader>
                <SheetTitle>
                    Menu
                </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col space-y-4 mt-6">
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                    <Link href="/">
                        <HomeIcon className="w-4 h-4" />
                        Home
                    </Link>
                </Button>

                {isSignedIn ? (
                    <>
                        <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                            <Link href="/notifications">
                                <BellIcon className="w-4 h-4" />
                                Notifications
                            </Link>
                        </Button>
                        
                        {isLoaded && profileUsername && (
                            <Link 
                                href={`/profile/${profileUsername}`}
                                className={navLinkClass}
                                onClick={() => setShowMobiileMenu(false)}
                            >
                                <UserIcon className="w-4 h-4" />
                                Profile
                            </Link>
                        )}

                        <SignOutButton>
                            <Button variant="ghost" className="flex items-center gap-3 justify-start w-full">
                                <LogOutIcon className="w-4 h-4" />
                                Logout
                            </Button>
                        </SignOutButton>

                    </>
                ) : (
                    <SignInButton mode="modal">
                        <Button variant="default" className="w-full">
                            Sign In
                        </Button>
                    </SignInButton>
                )}
            </nav>  
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
