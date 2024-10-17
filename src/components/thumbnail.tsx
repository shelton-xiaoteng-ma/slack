import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-[800px] border-none bg-transparent p-0 shadow-none"
        onClick={() => {
          setOpen(false);
        }}
      >
        <img
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full cursor-zoom-out"
        />
      </DialogContent>
    </Dialog>
  );
};
