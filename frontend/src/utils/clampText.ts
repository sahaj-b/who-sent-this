export default function clampText(text: string, limit: number) {
  const lines = text.split("\n");
  return lines.length <= limit
    ? text
    : lines.slice(0, limit).join("\n") + "...";
}
