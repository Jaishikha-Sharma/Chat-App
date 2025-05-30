const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-80 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-right w-full text-red-500 font-bold mb-4"
          aria-label="Close profile modal"
        >
          &times;
        </button>

        <div className="flex flex-col items-center gap-4">
          <img
            src={user.profilePic || "/avatar.avif"}
            alt={user.fullName || user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold">{user.fullName || user.name}</h2>
          <p className="text-gray-600">{user.email || "No email info"}</p>
          {user.bio && <p className="text-gray-500 text-center mt-2">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
