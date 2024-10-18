import { AvatarImage } from "@radix-ui/react-avatar";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface MessageProps {
  key: Id<"messages">;
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions?:
    | Array<
        Omit<Doc<"reactions">, "memberId"> & {
          count: number;
          memberIds: Id<"members">[];
        }
      >
    | void[];
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
  key,
  id,
  memberId,
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
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toUpperCase();
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
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
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="size-9">
            <AvatarImage src={authorImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
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
        </div>
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => seteditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
