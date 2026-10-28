"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Loader2Icon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { createPost } from "@/actions/post.action";
import Upload from "./Upload";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function CreatePost() {
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;

    setIsPosting(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const cloudName =
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset =
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary configuration is missing");
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok || !data.secure_url) {
          throw new Error(
            data.error?.message || "Image upload failed",
          );
        }

        imageUrl = data.secure_url;
      }

      const result = await createPost(content.trim(), imageUrl);

      if (!result?.success) {
        throw new Error("Failed to create post");
      }

      setContent("");
      setImageFile(null);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Failed to create post:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create post",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const canPost = Boolean(content.trim() || imageFile);

  return (
    <Card className="mb-6 overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5">
          <Avatar className="size-11 shrink-0 ring-2 ring-border">
            <AvatarImage
              src={user?.imageUrl || "/avatar.png"}
              alt="Your avatar"
            />
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user?.fullName || user?.username || "Your profile"}
            </p>
            <p className="text-xs text-muted-foreground">
              Share something with your community
            </p>
          </div>

          <SparklesIcon className="size-5 text-muted-foreground" />
        </div>

        {/* Composer */}
        <div className="px-5 pb-4 pt-3">
          <Textarea
            placeholder="What's happening?"
            className="min-h-28 resize-y border-0 bg-transparent px-2 py-2 text-base shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isPosting}
            aria-label="Write your post"
          />

          <div className="flex justify-end text-xs text-muted-foreground">
            {content.length > 0 && `${content.length} characters`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-5 py-3">
          <div className="flex min-w-0 items-center gap-1">
            <Upload
              onFileSelect={setImageFile}
              disabled={isPosting}
            />
            {imageFile && (
              <span className="max-w-32 truncate text-xs text-muted-foreground">
                {imageFile.name}
              </span>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canPost || isPosting}
            className="rounded-full px-5 font-semibold"
          >
            {isPosting ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                {imageFile ? "Uploading..." : "Posting..."}
              </>
            ) : (
              <>
                <SendIcon className="mr-2 size-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
