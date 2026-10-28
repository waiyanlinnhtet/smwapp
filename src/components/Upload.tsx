
"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";


type UploadProps = {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
};

export default function Upload({
  onFileSelect,
  disabled = false,
}: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const previewRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      event.target.value = "";
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const objectUrl = URL.createObjectURL(selected);
    previewRef.current = objectUrl;

    setFile(selected);
    setPreview(objectUrl);
    onFileSelect(selected);
  };

  const removeFile = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = "";
    }

    setFile(null);
    setPreview("");
    onFileSelect(null);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="post-image-input"
        onChange={selectFile}
        disabled={disabled}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() =>
          document.getElementById("post-image-input")?.click()
        }
        disabled={disabled}
      >
        <ImageIcon className="mr-2 size-4" />
        {file ? "Change photo" : "Photo"}
      </Button>

      {preview && (
        <div className="relative flex max-h-100 min-h-28 items-center justify-center overflow-hidden rounded-xl border bg-muted/30 p-2">
          <img
            src={preview}
            alt="Selected image preview"
            className="max-h-95 max-w-full rounded-lg object-contain"
            style={{ width: "auto", height: "auto" }}
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-3 top-3 size-8 rounded-full"
            onClick={removeFile}
            disabled={disabled}
            aria-label="Remove image"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
