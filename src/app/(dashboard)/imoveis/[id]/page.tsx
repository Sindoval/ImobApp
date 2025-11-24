"use client";

import { useEffect, useState } from "react";
import { getImovelById } from "@/app/_actions/imoveis";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ArrowDown, Captions, ChevronLeft, FilePlus, FileText, SquarePen, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UploadImovelImagem from "@/app/_components/upload-imovel-imagem";
import { ImovelComImagens, PedidoInfo } from "@/app/_types/estoque";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Fornecedor, ImovelImagem, Pedido } from "@/generated/prisma";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { AddPedidoDialog } from "@/app/_components/add-pedido-dialog";
import { getFornecedores } from "@/app/_actions/fornecedores";
import HandleVisaoDialog from "@/app/_components/handle-visao-dialog";
import HandleStatusDialog from "@/app/_components/handle-status-dialog";
import { getPedidosByImovel } from "@/app/_actions/pedidos";
import CardPedido from "@/app/_components/card-pedido";

interface ImovelPageProps {
  params: { id: string };
}

export default function ImovelPage({ params }: ImovelPageProps) {
  const { id } = params;
  const [imovel, setImovel] = useState<ImovelComImagens | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [pedidos, setPedidos] = useState<PedidoInfo[]>([]);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState<ImovelImagem | null>(null);

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openPedidoDialog, setOpenPedidoDialog] = useState(false);
  const [openPedidosListDialog, setOpenPedidosListDialog] = useState(false);
  const [openVisaoDialog, setOpenVisaoDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);

  const router = useRouter();

  async function fetchImovel() {
    const data = await getImovelById(id);
    setImovel(data as ImovelComImagens);
    if (data?.imagens?.length) {
      setMainImage(data.imagens[0].url);
    } else {
      setMainImage("/sem-foto.png");
    }
  }

  async function fetchPedidos() {
    const list = await getPedidosByImovel(id);
    setPedidos(list);
  }

  async function syncDocumentos() {
    await fetch("/api/imoveis/documentos/sync", {
      method: "POST",
      body: JSON.stringify({ imovelId: id }),
      headers: { "Content-Type": "application/json" }
    });

    await fetchImovel();
  }

  async function fetchFornecedoresList() {
    const data = await getFornecedores();
    setFornecedores(data);
  }

  useEffect(() => {
    async function load() {
      await syncDocumentos();
      await fetchFornecedoresList();
      await fetchPedidos();
    }
    load();
  }, []);

  async function handleDeleteImagem(imagemId: string) {
    const res = await fetch(`/api/imoveis/imagem/delete?id=${imagemId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) {
      toast.success("Imagem excluída com sucesso!");
      router.refresh();
    } else {
      toast.error(data.error || "Erro ao excluir imagem");
    }
  }

  function handlePedidoDialog(open: boolean) {
    setOpenPedidoDialog(open);

    if (!open) return;

    // 👉 Atualiza a lista quando terminar de adicionar
    setTimeout(() => {
      fetchPedidos();
    }, 400);
  }

  function handleOpenPedidosDialog(open: boolean) {
    setOpenPedidosListDialog(open);

    if (open) {
      fetchPedidos(); // atualiza toda vez que abrir
    }
  }

  function handleVisaoDialog(open: boolean) {
    setOpenVisaoDialog(open);
  }

  function handleStatusDialog(open: boolean) {
    setOpenStatusDialog(open);
  }

  function handleDescriptionUpdate(newDescription: string) {
    setImovel((prev) => prev ? { ...prev, descricao: newDescription } : null);
  }

  function handleStatusUpdate(newStatus: string) {
    setImovel((prev) => prev ? { ...prev, status: newStatus } : null);
  }

  if (!imovel) return <div className="text-center text-gray-300 mt-10">Carregando...</div>;

  return (
    <div className="relative">
      <Link href="/imoveis" className="absolute top-3 left-4">
        <ChevronLeft className="w-8 h-8" />
      </Link>

      <header className="flex flex-col justify-center items-center my-2 gap-2">
        <h2 className="text-2xl font-bold text-gray-200 my-4">Detalhes do Imóvel</h2>
      </header>

      {/* imagem principal */}
      <div className="relative w-full h-[30vh] aspect-video">
        <Image
          src={mainImage || "/sem-foto.png"}
          alt="Imagem do imóvel"
          fill
          className="object-cover object-center rounded-md"
          priority
        />
        <div className="absolute inset-0 bg-black/20 flex items-end justify-center">
          <h1 className="text-white text-2xl font-bold mb-4 px-2 opacity-90">
            {imovel?.endereco}
          </h1>
        </div>
      </div>

      <div className="my-2">
        <UploadImovelImagem imovelId={id} onUploaded={() => fetchImovel()} />
      </div>

      {/* miniaturas */}
      {imovel.imagens?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 mt-4 pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {imovel.imagens.map((img: ImovelImagem) => (
            <div
              key={img.id}
              className={`relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition ${mainImage === img.url ? "border-primary" : "border-transparent hover:border-gray-600"}`}
              onClick={() => setMainImage(img.url)}
            >
              <Image src={img.url} alt="Miniatura" fill className="object-cover" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagemSelecionada(img);
                  setOpenImageDialog(true);
                }}
                className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md opacity-70"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 mt-5">

        {/* visão geral */}
        <Card className="my-3">
          <CardContent className="p-5 relative">
            <Button className="absolute top-5 right-5" variant="link" onClick={() => handleVisaoDialog(true)}>
              <SquarePen />
            </Button>

            <CardHeader className="flex-row items-center gap-4 p-0">
              <Captions className="text-primary w-8 h-8" />
              <h3 className="text-white text-lg font-semibold">Visão Geral do Imóvel</h3>
            </CardHeader>

            <p className="text-sm text-gray-400 mt-4">{imovel.descricao}</p>
          </CardContent>
        </Card>

        {/* engenheiro */}
        <Card className="my-3 ">
          <CardContent className="px-5 flex justify-between items-center">
            <p className="text-sm text-gray-400 mt-4">Engenheiro Responsável</p>
            <Badge className="mt-auto px-6 py-1" variant="secondary">{imovel?.engenheiro.nome}</Badge>
          </CardContent>
        </Card>

        {/* status */}
        <Card className="my-3 ">
          <CardContent className="px-5 flex-col justify-between items-center">
            <div className="w-full relative">
              <Button className="absolute top-1 right-0" variant="link" onClick={() => setOpenStatusDialog(true)}>
                <SquarePen />
              </Button>
            </div>

            <p className="text-sm text-gray-400 mt-4">Status da reforma</p>
            <Badge className="mt-auto px-6">{imovel?.status}</Badge>
          </CardContent>
        </Card>

        {/* pedidos */}
        <Card className="my-3">
          <CardContent className="p-5">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <FileText className="text-primary w-8 h-8" />
              <h3 className="text-white text-lg font-semibold">Pedidos do imóvel</h3>
            </CardHeader>

            <div className="flex gap-4 mt-4">
              <Button variant="secondary" onClick={() => handleOpenPedidosDialog(true)}>
                <FileText className="mr-2" /> Ver Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* docs */}
        <Card className="my-3">
          <CardContent className="p-5">
            <CardHeader className="flex-row items-center gap-4 p-0">
              <FileText className="text-primary w-8 h-8" />
              <h3 className="text-white text-lg font-semibold">Documentação</h3>
            </CardHeader>

            <p className="text-sm text-gray-400 mt-4">Documentos anexados ao imóvel.</p>

            <Button variant="secondary" className="mt-4 w-60 flex justify-start" onClick={() => setOpenDocDialog(true)}>
              <FilePlus className="mr-2" /> Adicionar Documento
            </Button>

            <Button className="mt-4 w-60" variant="secondary" onClick={() => window.open(`/api/imoveis/documentos/download?id=${id}`)}>
              <ArrowDown /> Baixar Documentação Completa
            </Button>

            <div className="mt-4 space-y-2">
              {imovel.documentos?.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center bg-secondary p-3 rounded-md">
                  <span className="text-gray-300 text-sm">{doc.nome}</span>

                  <Button onClick={() => window.open(doc.url)}>
                    <ArrowDown className="h-4 w-4 mr-1" /> Baixar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EXCLUIR IMAGEM */}
      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="bg-neutral-900 border border-neutral-800 text-gray-200 w-[90%]">
          <DialogHeader>
            <DialogTitle>Excluir imagem</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-400 mt-2">
            Tem certeza que deseja excluir esta imagem? Esta ação não poderá ser desfeita.
          </p>

          {imagemSelecionada && (
            <div className="relative w-full h-32 mt-4 rounded-md overflow-hidden">
              <Image src={imagemSelecionada.url} alt="Imagem selecionada" fill className="object-cover" />
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenImageDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (imagemSelecionada) {
                  await handleDeleteImagem(imagemSelecionada.id);
                  setOpenImageDialog(false);
                  setImagemSelecionada(null);
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADICIONAR PEDIDO */}
      <AddPedidoDialog
        imovelId={id}
        openPedidoDialog={openPedidoDialog}
        handlePedidoDialog={handlePedidoDialog}
        fornecedores={fornecedores}
      />

      {/* LISTAR PEDIDOS */}
      <Dialog open={openPedidosListDialog} onOpenChange={handleOpenPedidosDialog}>
        <DialogContent
          className="
      w-[90%] 
      max-w-xl 
      max-h-[80vh] 
      overflow-hidden 
      text-gray-100 
      rounded-xl
    "
        >
          <DialogHeader>
            <DialogTitle>Pedidos vinculados ao imóvel</DialogTitle>
          </DialogHeader>

          <div
            className="
        mt-4 
        overflow-y-auto 
        pr-1 
        space-y-3
        max-h-[65vh]
        scrollbar-thin 
        scrollbar-thumb-gray-700 
        scrollbar-track-transparent
      "
          >
            {pedidos.length === 0 ? (
              <p className="text-sm text-gray-400">
                Nenhum pedido vinculado a este imóvel.
              </p>
            ) : (
              pedidos.map((p) => (
                <div key={p.id} className="w-full">
                  <CardPedido pedido={p} />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* EDITAR DESCRIÇÃO */}
      <HandleVisaoDialog
        openVisaoDialog={openVisaoDialog}
        handleVisaoDialog={handleVisaoDialog}
        id={imovel.id}
        descricao={imovel.descricao}
        handleDescriptionUpdate={handleDescriptionUpdate}
      />

      {/* EDITAR STATUS */}
      <HandleStatusDialog
        openStatusDialog={openStatusDialog}
        handleStatusDialog={handleStatusDialog}
        id={imovel.id}
        status={imovel.status}
        handleStatusUpdate={handleStatusUpdate}
      />

      {/* UPLOAD DOCUMENTOS */}
      <Dialog open={openDocDialog} onOpenChange={setOpenDocDialog}>
        <DialogContent className="w-[90%] text-gray-200">
          <DialogHeader>
            <DialogTitle>Adicionar documentação</DialogTitle>
          </DialogHeader>

          <Input type="file" accept="application/pdf,image/*" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDocDialog(false)}>
              Cancelar
            </Button>

            <Button
              onClick={async () => {
                if (!docFile) return toast.error("Selecione um arquivo");

                const formData = new FormData();
                formData.append("file", docFile);
                formData.append("imovelId", imovel.id);

                const res = await fetch("/api/imoveis/documentos/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                if (data.ok) {
                  toast.success("Documento enviado!");
                  setOpenDocDialog(false);
                  fetchImovel();
                } else {
                  toast.error(data.error);
                }
              }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
