"use client";
import Image from "next/image";
import { useState } from "react";
import type { Article } from "@/types/news";
import { Modal } from "@/components/ui/feedback";
export function GalleryGrid({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null);
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelected(article)}
            className="relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl text-left"
          >
            <Image src={article.image} alt="" width={800} height={560} className="h-auto w-full bg-slate-100 object-contain sm:object-cover dark:bg-slate-900" />
            <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 p-4 text-left text-sm font-bold text-white">
              {article.title}
            </span>
          </button>
        ))}
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? "Gallery image"}>
        {selected && <Image src={selected.image} alt="" width={1200} height={800} className="w-full rounded-xl object-contain" />}
      </Modal>
    </>
  );
}
