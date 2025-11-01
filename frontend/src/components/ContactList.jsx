import React from "react";
import { api } from "../api/api";

export default function ContactList({ contacts = [], refresh, setSelected }) {
  // Safe default: contacts = [] prevents undefined errors

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.deleteContact(id);
        refresh(); // Refresh contact list after deletion
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Failed to delete contact. Please try again.");
      }
    }
  };

  return (
    <table
      border="1"
      cellPadding="8"
      style={{
        width: "100%",
        textAlign: "left",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#25074cff" }}>
          <th>Name</th>
          <th>Mobile</th>
          <th>Alternate</th>
          <th>Address</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.firstName} {c.lastName}</td>
              <td>{c.primaryMobile}</td>
              <td>{c.alternateMobile || "N/A"}</td>
              <td>
                {[
                  c.addressLine1,
                  c.addressLine2,
                  c.city,
                  c.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </td>
              <td>{c.countryId?.country || c.countryName || "N/A"}</td>
              <td>
                <button
                  style={{
                    marginRight: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelected(c)}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
              No contacts available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
