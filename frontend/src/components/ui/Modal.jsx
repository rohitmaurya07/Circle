import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Children } from "react"

export const Modal = ({open,onOpenChange,children})=> {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl bg-content p-0 border-none shadow-none overflow-hidden rounded-2xl flex items-center justify-center ">
          <div className="relative w-full h-[90vh] md:w-[600px] md:h-[90vh] lg:w-[900px] lg:h-[90vh] xl:w-[1200px] xl:h-[90vh] 2xl:w-[1500px] 2xl:h-[90vh] 3xl:w-[1800px] 3xl:h-[90vh] 4xl:w-[2100px] 4xl:h-[90vh]">
            {children}
          </div>
        </DialogContent>     
    </Dialog>
  )
}
