export default function DropIndicator({ isVisible }) {
  return (
    <div
      className={`h-1 rounded-full bg-blue-500 transition-all duration-150 shadow-[0_0_8px_rgba(59,130,246,0.7)] ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
    />
  );
}
