import React, { useState } from "react";

function Profile() {

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@gmail.com",
    role: "Admin"
  });

  const [tempProfile, setTempProfile] = useState(profile);

  // EDIT CLICK
  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  // SAVE
  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="container mt-3">

      <h3 className="mb-4">My Profile</h3>

      <div className="card p-4 shadow-sm">

        {/* PROFILE VIEW */}
        {!isEditing ? (
          <div>

            <div className="mb-3">
              <strong>Name:</strong> {profile.name}
            </div>

            <div className="mb-3">
              <strong>Email:</strong> {profile.email}
            </div>

            <div className="mb-3">
              <strong>Role:</strong> {profile.role}
            </div>

            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Profile
            </button>

          </div>
        ) : (

          /* EDIT MODE */
          <div>

            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={tempProfile.name}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={tempProfile.email}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, email: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <input
                type="text"
                className="form-control"
                value={tempProfile.role}
                disabled
              />
            </div>

            <button className="btn btn-success me-2" onClick={handleSave}>
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;



