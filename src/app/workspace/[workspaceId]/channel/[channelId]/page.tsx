"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { ChatInput } from "./chat-input";
import { Header } from "./header";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({
    channelId,
  });

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">channel not found</p>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <Header title={channel.name} />
      <div className="flex-1">{JSON.stringify(results)}</div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};
export default ChannelIdPage;
