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


export default function TaskCard({ task, columnId, index, isDragging, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task, columnId, index);
      }}
      onDragEnd={onDragEnd}
      className={`bg-gray-800/90 border border-gray-700 rounded-xl p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg hover:border-gray-500/80 transition-all duration-200 hover:-translate-y-0.5 ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${columnColors[columnId]} text-black`}>
          {columnLabels[columnId]}
        </span>
        <span className={`text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <h3 className="text-gray-100 font-semibold text-[15px] mb-1">{task.title}</h3>
      <p className="text-gray-400 text-sm leading-snug">{task.description}</p>
    </div>
  );
}
