import React from "react";
import { api } from "../api/api";

export default function ContactList({ contacts, refresh, setSelected }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await api.deleteContact(id);
      refresh();
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Mobile</th>
          <th>Alternate</th>
          <th>Home</th>
          <th>Work</th>
          <th>Email</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((c) => (
          <tr key={c._id}>
            <td>{c.firstName} {c.lastName}</td>
            <td>{c.primaryMobile}</td>
            <td>{c.alternateMobile}</td>
            <td>{c.telHome}</td>
            <td>{c.telWork}</td>
            <td>{c.email}</td>
            <td>{c.countryId?.country}</td>
            <td>
              <button onClick={() => setSelected(c)}>Edit</button>
              <button onClick={() => handleDelete(c._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
