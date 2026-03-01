import { Dialog, DialogContent } from "@/components/ui/dialog"

export const Modal = ({ open, onOpenChange, children, intialWidth = "sm:max-w-md", intialHeight = "sm:h-[90vh]" }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${intialWidth} ${intialHeight} p-0 sm:rounded-2xl m-0 border-none bg-content flex overflow-hidden shadow-2xl`}>
        <div className="relative w-full h-full">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
