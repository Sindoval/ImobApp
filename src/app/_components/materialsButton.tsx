"use client"

import { BrickWall } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useState } from "react"

const MaterialsButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="mt-3 mb-5">
          <Button 
            className="w-full"
            onClick={ () => setIsDialogOpen(true) }
            >
            <BrickWall /> Solicitar Materiais
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                <DialogTitle>
                    Teste
                </DialogTitle>
                </DialogHeader>
                <h1>qwefewvw;</h1>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
    )
}

export default MaterialsButton;