import React, { useState } from "react";
import { X } from "lucide-react";
import DarkMultiSelect from "./DarkMultiSelect";

const CreateTask = ({ setCreateTask, enumValues, CreateTaskHandler,status,refetch }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: [],
    issueType: "",
    priority: "",
    category: "",
    storyPoints: "",
    labels: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleMultiChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      assignedTo: typeof value === "string" ? value.split(",") : value,
      // On autofill we get a stringified value
    });
  };
  if (!enumValues) {
    return (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
        <div className="relative bg-slate-900 w-full max-w-2xl p-6 rounded-2xl shadow-2xl border border-slate-700">
          {/* Cancel Button */}
          <button
            onClick={() => setCreateTask(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-semibold text-white mb-6">
            Create New Task
          </h2>
          <p>Loading Essential Things for creating task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative bg-slate-900 w-full max-w-2xl p-6 rounded-2xl shadow-2xl border border-slate-700">
        {/* Cancel Button */}
        <button
          onClick={() => setCreateTask(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6">
          Create New Task
        </h2>

        <form
          onSubmit={function (e) {
            e.preventDefault();
            CreateTaskHandler(formData,status);
            setFormData({
              title: "",
              description: "",
              dueDate: "",
              assignedTo: [],
              issueType: "",
              priority: "",
              category: "",
              storyPoints: "",
              labels: "",
            });
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Assigned To */}
          <DarkMultiSelect
            names={enumValues.assignedTo}
            changehandler={handleMultiChange}
            assignedTo={formData.assignedTo}
          />
          {/* Issue Type */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">
              Issue Type
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {enumValues?.issueType &&
                enumValues.issueType.map((e) => <option value={e}>{e}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {enumValues?.priority &&
                enumValues.priority.map((e) => <option value={e}>{e}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {enumValues?.category &&
                enumValues.category.map((e) => <option value={e}>{e}</option>)}
            </select>
          </div>

          {/* Story Points */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">
              Story Points
            </label>
            <input
              type="number"
              name="storyPoints"
              value={formData.storyPoints}
              onChange={handleChange}
              min="0"
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Labels */}
          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm mb-1">
              Labels{" "}
              <sub className="text-xs text-slate-300/30">
                seperate using comma ,
              </sub>
            </label>

            <input
              type="text"
              name="labels"
              value={formData.labels}
              onChange={handleChange}
              placeholder="e.g. UI, urgent"
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
