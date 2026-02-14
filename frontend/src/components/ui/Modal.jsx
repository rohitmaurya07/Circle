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
      <form>
        <DialogContent className="sm:max-w-sm">
          <div className="grid gap-4">
            {children}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
