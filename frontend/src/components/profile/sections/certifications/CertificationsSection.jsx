import React, { useState } from 'react';
import { X, Edit2, Plus, Calendar, Award, ExternalLink, CheckCircle } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

const CertificationsSection = ({ user, isOwnProfile, onSectionUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState(user?.certifications || []);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveCertification = async (certificationData) => {
    try {
      setLoading(true);
      let updatedCertifications;
      
      if (editingIndex !== null) {
        // Edit existing certification
        updatedCertifications = [...certifications];
        updatedCertifications[editingIndex] = certificationData;
      } else {
        // Add new certification
        updatedCertifications = [...certifications, certificationData];
      }
      
      await axiosInstance.patch("/user/profile/update", { certifications: updatedCertifications });
      setCertifications(updatedCertifications);
      setShowEditModal(false);
      setEditingIndex(null);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error updating certifications:", error);
      alert("Failed to update certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCertification = async (indexToRemove) => {
    const updatedCertifications = certifications.filter((_, index) => index !== indexToRemove);
    try {
      setLoading(true);
      await axiosInstance.patch("/user/profile/update", { certifications: updatedCertifications });
      setCertifications(updatedCertifications);
      onSectionUpdate?.();
    } catch (error) {
      console.error("Error removing certification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCertification = (index) => {
    setEditingIndex(index);
    setShowEditModal(true);
  };

  if (!isOwnProfile && (!certifications || certifications.length === 0)) {
    return null; // Don't show section for other users if they have no certifications
  }

  return (
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Certifications</h3>
              <p className="text-sm text-gray-300">Professional certifications and achievements</p>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <div className="p-6">
        {certifications && certifications.length > 0 ? (
          <div className="space-y-6">
            {certifications.map((cert, i) => (
              <div key={i} className="relative group">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{cert.name}</h4>
                        <p className="text-gray-200 font-medium">{cert.organization}</p>
                        {cert.issuer && (
                          <p className="text-gray-400 text-sm">{cert.issuer}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {cert.issueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Issued: {cert.issueDate}
                            </div>
                          )}
                          {cert.expirationDate && !cert.doesNotExpire && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Expires: {cert.expirationDate}
                            </div>
                          )}
                          {cert.doesNotExpire && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              No Expiration
                            </div>
                          )}
                        </div>
                        {cert.credentialId && (
                          <p className="text-gray-400 text-sm mt-1">ID: {cert.credentialId}</p>
                        )}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mt-2 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Credential
                          </a>
                        )}
                      </div>
                      {isOwnProfile && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleEditCertification(i)}
                            className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveCertification(i)}
                            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < certifications.length - 1 && (
                  <div className="ml-6 mt-4 border-l-2 border-white/10"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Certifications Added Yet</h4>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {isOwnProfile 
                ? "Showcase your professional achievements by adding your certifications and credentials."
                : "This user hasn't added any certifications yet."
              }
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Your First Certification
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showEditModal && (
        <CertificationModal
          certification={editingIndex !== null ? certifications[editingIndex] : null}
          onSave={handleSaveCertification}
          onClose={() => {
            setShowEditModal(false);
            setEditingIndex(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

const CertificationModal = ({ certification, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: certification?.name || '',
    organization: certification?.organization || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expirationDate: certification?.expirationDate || '',
    credentialId: certification?.credentialId || '',
    credentialUrl: certification?.credentialUrl || '',
    doesNotExpire: certification?.doesNotExpire || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/10">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {certification ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <p className="text-sm text-gray-400">
                {certification ? 'Update your certification details' : 'Add your professional certification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Issuing Organization
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., AWS Training and Certification"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Issue Date *
                </label>
                <input
                  type="month"
                  required
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Expiration Date
                </label>
                <input
                  type="month"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  disabled={formData.doesNotExpire}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl border border-purple-400/30">
              <input
                type="checkbox"
                id="doesNotExpire"
                checked={formData.doesNotExpire}
                onChange={(e) => setFormData({...formData, doesNotExpire: e.target.checked, expirationDate: ''})}
                className="w-4 h-4 bg-purple-500 border-purple-400 rounded text-white focus:ring-purple-400 focus:ring-offset-2"
              />
              <label htmlFor="doesNotExpire" className="text-sm font-medium text-gray-200">
                This certification does not expire
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Credential ID
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., AWS-ASA-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Credential URL
              </label>
              <input
                type="url"
                value={formData.credentialUrl}
                onChange={(e) => setFormData({...formData, credentialUrl: e.target.value})}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="https://credential.verify.com/abc123"
              />
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex gap-3 p-6 border-t border-white/10 shrink-0 bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-xl transition-colors border border-white/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Saving..." : (certification ? "Update Certification" : "Add Certification")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificationsSection;
