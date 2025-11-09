"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UploadImovelImagemProps {
  imovelId: string;
  onUploaded?: (url: string) => void; // callback para atualizar a lista de imagens
}

export default function UploadImovelImagem({ imovelId, onUploaded }: UploadImovelImagemProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("imovelId", imovelId);

    try {
      const res = await fetch("/api/imoveis/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar imagem");

      toast.success("Imagem enviada com sucesso!");
      router.refresh();
      if (onUploaded) onUploaded(data.img.url);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro inesperado");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        variant="secondary"
      >
        {uploading ? "Enviando..." : "Adicionar Imagem"}
      </Button>
    </div>
  );
}
