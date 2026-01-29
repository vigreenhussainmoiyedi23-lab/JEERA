import React, { useState } from "react";
import TaskCard from "./TaskCard";
import DropIndicator from "./DropIndicator.jsx";
import CreateTask from "./CreateTask.jsx";
import TaskMore from "./TaskMore.jsx";
import { PlusCircle } from "lucide-react";

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
  socket,
  setTasks,
  currentUser,
  userRole,
  userId,
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
  // console.log(taskMore);
  return (
    <>
      <div
        className={`flex flex-col shrink-0 xl:w-1/5 sm:w-1/3 w-1/2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] border-t-4 transition-all duration-200 ${
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
          <h2 className="font-semibold text-base sm:text-lg text-white tracking-tight">
            {column.label}
          </h2>
          <span className="text-xs font-semibold text-gray-200/80 bg-black/25 border border-white/10 px-2.5 py-1 rounded-full">
            {tasks?.length || 0}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4 pt-2 flex-1 min-h-50">
          <button
            onClick={function (e) {
              setCreateTask(column.id);
            }}
            className="group bg-black/25 border border-white/10 hover:bg-white/10 active:bg-white/5 h-24 flex items-center justify-center text-4xl font-bold rounded-3xl px-3 w-full capitalize py-2 transition"
          >
            <PlusCircle className="text-gray-200/80 group-hover:text-white transition" />
          </button>
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
                      columnAccentColors={columnAccentColors[column.id]}
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
      {taskMore && (
        <TaskMore
          setTasks={setTasks}
          tasks={tasks}
          taskId={taskMore}
          socket={socket}
          onClose={onClose}
          enumValues={enumValues}
          currentUserRole={userRole}
          currentUserId={userId}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
