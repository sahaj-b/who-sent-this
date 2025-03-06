import { Icon } from "@iconify/react/dist/iconify.js";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Icon
        icon="svg-spinners:pulse-rings-2"
        className="text-primary text-6xl"
      />
    </div>
  );
}
