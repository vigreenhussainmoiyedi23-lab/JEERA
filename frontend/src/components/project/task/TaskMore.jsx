import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
const TaskMore = ({ task, onClose, socket }) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    // queryKey: ["taskMore",task],
    queryFn: async () => (await axiosInstance.get(`/task/more/${task}`)).data.task,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!task,

  });
  if (isLoading || isError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {isLoading && <p>Loading Task Details</p>}
        {isError && (
          <>
            <p>Loading Task Details</p>
            <button onClick={refetch}>Retry</button>
          </>
        )}
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#0F1726] text-white rounded-2xl shadow-xl w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{data?.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-4">{data?.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <p className="text-sm text-gray-400">Issue Type</p>
            <p className="font-medium capitalize">{data?.issueType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Priority</p>
            <p className="font-medium capitalize">{data?.priority}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="font-medium capitalize">{data?.taskStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Category</p>
            <p className="font-medium capitalize">{data?.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Story Points</p>
            <p className="font-medium">{data?.storyPoints ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Due Date</p>
            <p className="font-medium">
              {data?.dueDate
                ? new Date(data.dueDate).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* History Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">History</h3>
          {data?.history?.length > 0 ? (
            <ul className="space-y-2">
              {data.history.map((entry, idx) => {
                console.log(entry);
                return (
                  <li
                    key={idx}
                    className="bg-[#1a253a] p-3 rounded-lg text-sm text-gray-300"
                  >
                    <p>
                      <span className="text-gray-400">Action:</span>{" "}
                      {entry.action}
                    </p>
                    <p>
                      <span className="text-gray-400">By:</span>{" "}
                      {entry.user?.username}
                    </p>
                    <p>
                      <span className="text-gray-400">Date:</span>{" "}
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No history recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskMore;
