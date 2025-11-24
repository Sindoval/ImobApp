import { Card, CardContent } from "./ui/card";

const Footer = () => {
  return (
    <footer>
      <Card className="md:mt-20 border-none rounded-none">
        <CardContent className="px-5 py-6 text-center">
          <p className="text-sm text-gray-400">© 2025 Copyright <span className="font-bold">Imob.</span></p>
        </CardContent>
      </Card>
    </footer>
  );
}

export default Footer;