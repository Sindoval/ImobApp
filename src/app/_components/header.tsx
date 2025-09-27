import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarButton from "./imob-sheet";

const Header = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-3 flex flex-row items-center justify-between">
        <Link href={"/"}>
          <Image
            alt="Imob. logo"
            src="/imob-logo2.png"
            height={18}
            width={110}
          />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarButton />
        </Sheet>

      </CardContent>
    </Card>
  );
}

export default Header;