import React, { useState, useEffect } from "react";
import { api } from "./api/api";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./App.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadContacts = async () => {
    const res = await api.getContacts();
    setContacts(res.data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <div className="App">
      <div className="form-container">
        <ContactForm
          selected={selected}
          refresh={loadContacts}
          clearSelection={() => setSelected(null)}
        />
      </div>

      <div className="list-container">
        <ContactList
          contacts={contacts}
          refresh={loadContacts}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}
