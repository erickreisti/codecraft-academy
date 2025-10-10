"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageRemove?: () => void;
  currentImage?: string | null;
  folder: "courses" | "posts" | "avatars";
  userId: string;
  maxSize?: number; // em MB
  aspectRatio?: "square" | "video" | "banner";
  className?: string;
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  folder,
  userId,
  maxSize = 5,
  aspectRatio = "square",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset do input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsUploading(true);

    try {
      // Validação básica no cliente
      if (!file.type.startsWith("image/")) {
        toast.error("Selecione uma imagem válida");
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Arquivo muito grande. Máximo: ${maxSize}MB`);
        return;
      }

      // Preview antes do upload
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Importa e executa upload
      const { uploadCourseImage, uploadPostImage, uploadAvatar } = await import(
        "@/lib/utils/upload"
      );

      let result;
      switch (folder) {
        case "courses":
          result = await uploadCourseImage(file, userId);
          break;
        case "posts":
          result = await uploadPostImage(file, userId);
          break;
        case "avatars":
          result = await uploadAvatar(file, userId);
          break;
        default:
          throw new Error("Pasta inválida");
      }

      if (result.error) {
        toast.error("Erro no upload", {
          description: result.error,
        });
        setPreviewUrl(currentImage || null);
        return;
      }

      // Limpa preview temporário
      URL.revokeObjectURL(objectUrl);

      // Atualiza preview com URL permanente
      setPreviewUrl(result.url);

      // Notifica componente pai
      onImageUpload(result.url);

      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("💥 Erro no upload:", error);
      toast.error("Erro ao fazer upload da imagem");
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
    toast.info("Imagem removida");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      // Cria um DataTransfer para simular um input file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Cria um input file temporário
      const tempInput = document.createElement("input");
      tempInput.type = "file";
      tempInput.files = dataTransfer.files;

      // Cria um evento change válido
      const changeEvent = {
        target: tempInput,
        currentTarget: tempInput,
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileSelect(changeEvent);
    }
  };

  // ✅ FUNÇÃO handleDragOver ADICIONADA AQUI
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Classes de aspecto ratio
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[16/6]",
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label htmlFor="image-upload">Imagem</Label>

      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          previewUrl
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
            : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver} // ✅ AGORA ESTÁ DEFINIDA
      >
        {previewUrl ? (
          // PREVIEW DA IMAGEM
          <div className="relative p-4">
            <div
              className={`relative ${aspectClasses[aspectRatio]} rounded-md overflow-hidden bg-muted`}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay de ações */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ÁREA DE UPLOAD VAZIA
          <div className="p-8 text-center">
            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Enviando imagem...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">
                    Arraste uma imagem ou clique para selecionar
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF até {maxSize}MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input file hidden */}
      <input
        id="image-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Dicas de uso */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 Arraste e solte ou clique para selecionar</p>
        <p>
          📏 Formato recomendado:{" "}
          {aspectRatio === "square"
            ? "Quadrada (1:1)"
            : aspectRatio === "video"
            ? "Retangular (16:9)"
            : "Banner (16:6)"}
        </p>
      </div>
    </div>
  );
}
