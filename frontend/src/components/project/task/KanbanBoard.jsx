import { useState, useCallback } from "react";
import KanbanColumn  from "./KanbanColumn.jsx";

const columns = [
  { id: "toDo", label: "To Do" },
  { id: "inProgress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

const initialTasks = {
  toDo: [
    { id: "1", title: "Create Login UI", description: "Make responsive layout", priority: "high" },
    { id: "2", title: "Set up Lint Rules", description: "Add ESLint & Prettier", priority: "low" },
  ],
  inProgress: [
    { id: "3", title: "Implement Auth API", description: "JWT + refresh tokens", priority: "medium" },
  ],
  review: [
    { id: "4", title: "Optimize DB Queries", description: "Add indexing for performance", priority: "high" },
  ],
  done: [
    { id: "5", title: "Deploy Backend", description: "Render with env vars", priority: "high" },
  ],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragState, setDragState] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null);

  const handleDragStart = useCallback((task, columnId, index) => {
    setDragState({ task, fromColumnId: columnId, fromIndex: index });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropIndicator(null);
  }, []);

  const handleDragOver = useCallback((e, columnId, index) => {
    e.preventDefault();
    setDropIndicator((prev) => {
      if (prev?.columnId === columnId && prev?.index === index) return prev;
      return { columnId, index };
    });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropIndicator(null);
  }, []);

  const handleDrop = useCallback(
    (e, targetColumnId) => {
      e.preventDefault();
      if (!dragState || !dropIndicator) {
        handleDragEnd();
        return;
      }

      const { task, fromColumnId, fromIndex } = dragState;
      let targetIndex = dropIndicator.index;

      const newTasks = { ...tasks };
      newTasks[fromColumnId] = [...newTasks[fromColumnId]];
      newTasks[fromColumnId].splice(fromIndex, 1);

      if (fromColumnId === targetColumnId && fromIndex < targetIndex) {
        targetIndex = targetIndex - 1;
      }

      newTasks[targetColumnId] = [...newTasks[targetColumnId]];
      targetIndex = Math.max(0, Math.min(targetIndex, newTasks[targetColumnId].length));
      newTasks[targetColumnId].splice(targetIndex, 0, task);

      setTasks(newTasks);
      handleDragEnd();
    },
    [dragState, dropIndicator, tasks, handleDragEnd]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Project Board</h1>
        <p className="text-gray-400">Drag and drop tasks to manage your workflow</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks[column.id]}
            dragState={dragState}
            dropIndicator={dropIndicator}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
