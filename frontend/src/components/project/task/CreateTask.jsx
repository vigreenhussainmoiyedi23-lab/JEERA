import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import DarkMultiSelect from "./DarkMultiSelect";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
const CreateTask = ({
  setCreateTask,
  enumValues,
  CreateTaskHandler,
  status,
  refetch,
}) => {
  const [step, setStep] = useState(1);
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

  const steps = [
    "Enter task title and description,set due date",
    "Set issue type, priority & assign team member",
    "Add remaining details and create the task",
  ];
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
  const [canBeSubmited, setCanBeSubmited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      checkSubmission(newData); // ← use the fresh value!
      return newData;
    });
  };

  const handleMultiChange = (event) => {
    const {
      target: { value },
    } = event;

    setFormData((prev) => {
      const assigned = typeof value === "string" ? value.split(",") : value;
      const newData = {
        ...prev,
        assignedTo: assigned,
      };
      checkSubmission(newData); // ← fresh data
      return newData;
    });
  };

  // Renamed slightly so it's clear it's not the same as HTMLFormElement.submit
  function checkSubmission(data) {
    // Required fields — adjust this list to match what YOU really require
    const requiredFields = [
      "title",
      "description",
      "dueDate",
      "issueType",
      "priority",
      "assignedTo",
      "category",
      "storyPoints",
      "labels",
    ];

    const isComplete = requiredFields.every((field) => {
      const val = data[field];

      if (Array.isArray(val)) {
        return val.length > 0;
      }
      // Treat empty string, null, undefined as not filled
      return val != null && val !== "";
    });

    setCanBeSubmited(isComplete);
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
        <div className="mb-3">
          <Box sx={{ width: "100%", color: "white" }}>
            <Stepper activeStep={step - 1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <p className="text-slate-300">{label}</p>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>

        <form
          onSubmit={function (e) {
            e.preventDefault();
            if (step < 3) {
              return;
            }
            CreateTaskHandler(formData, status);
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
          {step === 1 && (
            <>
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
            </>
          )}

          {step === 2 && (
            <>
              {/* Assigned To */}
              <div
                className=" py-2 md:mb-3 mb-4 flex items-start
               justify-start flex-col"
              >
                {/* <p className="block text-slate-300 text-sm mb-1">Assigned To</p> */}
                <DarkMultiSelect
                  names={enumValues.assignedTo}
                  changehandler={handleMultiChange}
                  assignedTo={formData.assignedTo}
                />
              </div>
              <div className="flex md:flex-col gap-3 items-center justify-between">
                {/* priority & issueType*/}
                {/* Issue Type */}
                <div className="md:w-full w-1/2">
                  <label className="block  text-slate-300 text-sm mb-1">
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
                      enumValues.issueType.map((e) => (
                        <option value={e}>{e}</option>
                      ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="md:w-full w-1/2">
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
                      enumValues.priority.map((e) => (
                        <option value={e}>{e}</option>
                      ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
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
                    enumValues.category.map((e) => (
                      <option value={e}>{e}</option>
                    ))}
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
            </>
          )}

          {/* Submit */}
          <div className="md:col-span-2 flex justify-between items-center mt-4 ">
            {step > 1 && (
              <button
                onClick={() => {
                  setStep((prev) => {
                    if (prev == 1) return prev;
                    return prev - 1;
                  });
                }}
                className="px-3 py-2 flex rounded-2xl bg-slate-400 active:scale-90"
              >
                Prev <ArrowLeft />
              </button>
            )}
            {step < 3 && (
              <button
                onClick={() => {
                  setStep((prev) => {
                    if (prev == 3) return prev;
                    return prev + 1;
                  });
                }}
                className="px-3 py-2 flex rounded-2xl bg-blue-400 active:scale-90"
              >
                Next <ArrowRight />
              </button>
            )}
            {step == 3 && (
              <button
                type="submit"
                className={`${canBeSubmited ? " bg-blue-600  hover:bg-blue-700" : "bg-gray-500 pointer-events-none hover:bg-gray-400"} text-white font-medium px-6 py-2 rounded-lg transition`}
              >
                Create Task
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
