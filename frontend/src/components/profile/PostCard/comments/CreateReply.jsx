const CreateReply = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      {/* ➕ Add Comment */}
      Reply
      <textarea
        placeholder="Write a comment..."
        className="flex-1 resize-none bg-transparent border border-gray-600 rounded-lg p-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"></button>
    </div>
  );
};

export default CreateReply;
