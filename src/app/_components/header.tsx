import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

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
        <Button variant="ghost" >
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  );
}

export default Header;