"use client";
import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";

async function getCroppedImg(imageSrc, crop, zoom, aspect) {
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("Failed to load image. Ensure the image source allows cross-origin access."));
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const scaleX = naturalWidth / image.width;
    const scaleY = naturalHeight / image.height;

    const cropWidth = (crop.width * naturalWidth) / 100;
    const cropHeight = (crop.height * naturalHeight) / 100;
    const cropX = (crop.x * naturalWidth) / 100;
    const cropY = (crop.y * naturalHeight) / 100;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
      image,
      cropX / scaleX,
      cropY / scaleY,
      cropWidth / scaleX,
      cropHeight / scaleY,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return canvas.toDataURL("image/jpeg", 0.9);
  } catch (error) {
    throw new Error(`Image cropping failed: ${error.message}`);
  }
}

export default function ImageCropper({ src, aspect = 1, onCropped }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedArea(_croppedArea);
  }, []);

  const finish = useCallback(async () => {
    if (!src || !croppedArea) return;
    setLoading(true);
    setError("");
    try {
      const result = await getCroppedImg(src, croppedArea, zoom, aspect);
      onCropped?.(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [src, croppedArea, zoom, aspect, onCropped]);

  return (
    <div className="grid gap-2">
      <div className="relative w-full h-64 bg-black/20">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
        <button
          type="button"
          onClick={finish}
          disabled={loading}
          className="px-3 py-1.5 rounded bg-black text-white dark:bg-white dark:text-black disabled:opacity-50"
        >
          {loading ? "Cropping..." : "Crop"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}