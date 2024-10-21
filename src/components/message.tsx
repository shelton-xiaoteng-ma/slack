import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { UseConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Hint } from "./hint";
import { Reactions } from "./reactions";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  key: Id<"messages">;
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions?: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["_creationTime"] | undefined;
  createdAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  seteditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "hh:mm")}`;
};

export const Message = ({
  // key,
  id,
  // memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  isCompact,
  seteditingId,
  hideThreadButton,
  // threadCount,
  // threadImage,
  // threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = UseConfirm(
    "Delete Message",
    "Are you sure you want to delete this message, This cannot be undone"
  );

  const avatarFallback = authorName.charAt(0).toUpperCase();

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();

  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending =
    isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message Updated");
          seteditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onSuccess: () => {
          toast.success("Success to toggle reaction");
        },
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message Deleted");
          seteditingId(null);
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          {isEditing && (
            <div className="w-full h-full ">
              <Editor
                defaultValue={JSON.parse(body)}
                onCancel={() => seteditingId(null)}
                onSubmit={handleUpdate}
                disabled={isPending}
                variant="update"
              />
            </div>
          )}
          {!isEditing && (
            <div className="flex items-start gap-2">
              <Hint label={formatFullTime(new Date(createdAt!))}>
                <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px]">
                  {format(new Date(createdAt!), "hh:mm")}
                </button>
              </Hint>
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                {image && <Thumbnail url={image} />}
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                {reactions && (
                  <Reactions data={reactions} onChange={handleReaction} />
                )}
              </div>
            </div>
          )}
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => seteditingId(id)}
              handleThread={() => {}}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="size-9">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {!isEditing && (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt!))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt!), "h:mm a")}
                  </button>
                </Hint>
              </div>

              <Renderer value={body} />
              {image && <Thumbnail url={image} />}
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              {reactions && (
                <Reactions data={reactions} onChange={handleReaction} />
              )}
            </div>
          )}
          {isEditing && (
            <div className="w-full h-full ">
              <Editor
                defaultValue={JSON.parse(body)}
                onCancel={() => seteditingId(null)}
                onSubmit={handleUpdate}
                disabled={isPending}
                variant="update"
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => seteditingId(id)}
            handleThread={() => {}}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
