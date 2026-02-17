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

export const Modal = ({ open, onOpenChange, children }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full p-0 sm:max-w-md sm:h-[90vh] sm:rounded-2xl m-0 border-none bg-content flex items-center justify-center overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
