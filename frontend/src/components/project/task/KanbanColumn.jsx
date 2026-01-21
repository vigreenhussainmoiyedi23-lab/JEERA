import React, { useState } from "react";
import TaskCard from "./TaskCard";
import DropIndicator from "./DropIndicator.jsx";
import CreateTask from "./CreateTask.jsx";
import TaskMore from "./TaskMore.jsx";

const columnAccentColors = {
  toDo: "border-t-yellow-500",
  Inprogress: "border-t-blue-500",
  Inreview: "border-t-purple-500",
  done: "border-t-green-500",
  Failed: "border-t-red-500",
};

export default function KanbanColumn({
  column,
  tasks,
  dragState,
  dropIndicator,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  createTaskHandler,
  enumValues,
}) {
  const onClose = async () => {
    setTaskMore(null);
  };
  const [createTask, setCreateTask] = useState(null);
  const isColumnHighlighted =
    dragState && dropIndicator?.columnId === column.id;
  const isDraggingFromThis = dragState?.fromColumnId === column.id;
  if (!tasks || !Array.isArray(tasks)) {
    tasks = [];
  }
  const [taskMore, setTaskMore] = useState(null);
  return (
    <>
      <div
        className={`flex flex-col shrink-0 xl:w-1/5 sm:w-1/3 w-1/2 bg-gray-900/80 rounded-2xl border border-gray-700 shadow-lg border-t-4 transition-all duration-200 ${
          columnAccentColors[column.id]
        } ${isColumnHighlighted ? "ring-2 ring-blue-500/40 bg-gray-900" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, column.id, tasks.length);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            onDragLeave();
          }
        }}
        onDrop={(e) => onDrop(e, column.id)}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="font-semibold text-lg text-gray-200 tracking-wide">
            {column.label}
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
            {tasks?.length || 0}
          </span>
        </div>
        <button
          onClick={function (e) {
            setCreateTask(column.id);
          }}
          className="bg-slate-700 rounded-3xl px-3 w-max capitalize py-2 self-end mx-5"
        >
          add task
        </button>
        <div className="flex flex-col gap-2 p-4 pt-2 flex-1 min-h-[200px]">
          <DropIndicator
            isVisible={
              dropIndicator?.columnId === column.id &&
              dropIndicator?.index === 0
            }
          />

          {tasks.length > 0 &&
            tasks.map((task, index) => {
              const isBeingDragged =
                isDraggingFromThis && dragState?.fromIndex === index;
              return (
                <React.Fragment key={task._id}>
                  <div
                    
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const midY = rect.top + rect.height / 2;
                      const dropIndex = e.clientY < midY ? index : index + 1;
                      onDragOver(e, column.id, dropIndex);
                    }}
                  >
                    <TaskCard
                      task={task}
                      columnId={column.id}
                      index={index}
                      isDragging={isBeingDragged}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      setTaskMore={setTaskMore}
                    />
                  </div>
                  <DropIndicator
                    isVisible={
                      dropIndicator?.columnId === column.id &&
                      dropIndicator?.index === index + 1
                    }
                  />
                </React.Fragment>
              );
            })}

          {tasks.length === 0 && dragState && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
              Drop here
            </div>
          )}
        </div>
      </div>

      {createTask && (
        <CreateTask
          setCreateTask={setCreateTask}
          CreateTaskHandler={createTaskHandler}
          enumValues={enumValues}
          status={column.id}
        />
      )}
      {taskMore && <TaskMore task={taskMore} onClose={onClose} />}
    </>
  );
}
