import React from "react";

const TaskCard = ({task}) => {
  return (
      <div
        key={task._id}
        className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:scale-[1.02] transition"
      >
        <h3 className="text-lg font-bold text-white">{task.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{task.categoury}</p>
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            task.taskStatus === "finished"
              ? "bg-green-600/30 text-green-400"
              : task.taskStatus === "Inprogress"
              ? "bg-yellow-600/30 text-yellow-400"
              : "bg-gray-600/30 text-gray-300"
          }`}
        >
          {task.taskStatus}
        </span>
      </div>
    
  );
};

export default TaskCard;
