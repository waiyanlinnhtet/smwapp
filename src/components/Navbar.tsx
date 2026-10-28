import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

async function Navbar() {
    const user = await currentUser();
    if (user) await syncUser();
    
  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        bg-background/95
        backdrop-blur
        supports-[backdrop=filter]:bg-background/60
    "
    >
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16">
                <div className="flex shrink-0 items-center">
                    <Link 
                        href="/"
                        className="text-xl font-bold text-primary tracking-wider"
                    >
                        Wanhsta
                    </Link>
                </div>

                <div className="hidden flex-1 justify-end md:flex">
                    <DesktopNavbar />
                </div>

                <div className="ml-auto md:hidden">
                    <MobileNavbar /> 
                </div>

            </div>
        </div>
    </nav>
  );
}

export default Navbar;
