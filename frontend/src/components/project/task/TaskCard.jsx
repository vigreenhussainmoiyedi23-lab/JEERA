const columnColors = {
  toDo: "bg-yellow-500",
  Inprogress: "bg-blue-500",
  Inreview: "bg-purple-500",
  done: "bg-green-500",
  Failed: "bg-red-500",
};

const columnLabels = {
  toDo: "To Do",
  Inprogress: "In Progress",
  Inreview: "In Review",
  done: "Done",
  Failed: "Failed",
};

const priorityColors = {
  low: "text-green-400",
  medium: "text-amber-400",
  high: "text-red-400",
  critical: "text-orange-500",
  highest: "text-red-600",
};

export default function TaskCard({
  task,
  columnId,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  setTaskMore,
  columnAccentColors
}) {
  return (
    <div
      onClick={() => {
        setTaskMore(task._id);
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task, columnId, index);
      }}
      onDragEnd={onDragEnd}
      className={`bg-white/5 ${priorityColors[task.priority]} border border-white/10 border-t-4 ${columnAccentColors} rounded-2xl p-4 cursor-grab active:cursor-grabbing shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)] hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${columnColors[columnId]} text-black shadow-sm`}
        >
          {columnLabels[columnId]}
        </span>
        <span
          className={`text-[11px] bg-black/25 border border-white/10 rounded-full capitalize font-semibold px-3 py-1 ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-1">
        {task.title}
      </h3>
      <p className="text-gray-200/70 leading-relaxed text-xs sm:text-sm">
        {task.description}
      </p>
    </div>
  );
}
