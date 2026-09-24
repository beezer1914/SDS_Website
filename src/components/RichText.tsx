import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { imageUrl } from "@/lib/content";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = imageUrl(value);
      // Sanity's CDN already resizes/formats; next/image optimization is off for static export.
      // eslint-disable-next-line @next/next/no-img-element
      return src ? <img src={src} alt={value.alt ?? ""} loading="lazy" /> : null;
    },
    youtube: ({ value }) => {
      const id = youtubeId(value.url ?? "");
      if (!id) return null;
      return (
        <div className="my-6 aspect-video">
          <iframe
            className="h-full w-full rounded-lg"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={value.title ?? "YouTube video"}
            allowFullScreen
          />
        </div>
      );
    },
  },
};

export default function RichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
