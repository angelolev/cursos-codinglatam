// Renders a JSON-LD structured-data block. Server-safe; the JSON is serialized
// once and injected so search engines can parse Course/Organization schemas.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
