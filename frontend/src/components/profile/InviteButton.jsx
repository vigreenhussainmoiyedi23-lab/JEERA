import { useState } from "react";
import { UserPlus, X, Briefcase, Send } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

function InviteButton({ targetUserId, targetUsername }) {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/project-invite/projects/${targetUserId}`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteClick = () => {
    setShowModal(true);
    fetchProjects();
  };

  const handleInvite = async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      await axiosInstance.post("/project-invite/invite", {
        userId: targetUserId,
        projectId: selectedProject._id,
        message: message || `You've been invited to join ${selectedProject.name}`
      });

      alert("Invitation sent successfully!");
      setShowModal(false);
      setSelectedProject(null);
      setMessage("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert(error.response?.data?.message || "Error sending invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleInviteClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <UserPlus size={16} />
        Invite to Project
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Invite {targetUsername} to Project
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase size={48} className="text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">
                  You don't have any projects where you can invite users
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Project
                  </label>
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        onClick={() => setSelectedProject(project)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProject?._id === project._id
                            ? "border-blue-500 bg-blue-500/20"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                      >
                        <h4 className="font-medium text-white">{project.name}</h4>
                        {project.description && (
                          <p className="text-sm text-gray-400 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`You've been invited to join ${selectedProject.name}`}
                      className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={!selectedProject || loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {loading ? "Sending..." : "Send Invite"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default InviteButton;
