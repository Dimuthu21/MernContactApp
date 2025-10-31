import React, { useState, useEffect } from "react";
import { api } from "../api/api";

export default function ContactForm({ selected, refresh, clearSelection }) {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    city: "",
    postalCode: "",
    telHome: "",
    telWork: "",
    primaryMobile: "",
    alternateMobile: "",
    email: "",
    countryId: "",
    countryName: "", // for new country input
  });
  const [errors, setErrors] = useState({});

  // Load countries when component mounts
  useEffect(() => {
    api.getCountries().then((res) => setCountries(res.data));
  }, []);

  // When editing contact, fill form
  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.primaryMobile) newErrors.primaryMobile = "Mobile number is required";
    if (!form.countryId && !form.countryName)
      newErrors.countryId = "Select or add a country";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let selectedCountryId = form.countryId;

      // If user typed a new country, create it first
      if (!form.countryId && form.countryName) {
        const res = await api.createCountry({ country: form.countryName });
        selectedCountryId = res.data.data._id;
      }

      const contactData = {
        ...form,
        countryId: selectedCountryId,
      };

      if (selected) {
        await api.updateContact(selected._id, contactData);
        alert("Contact updated successfully");
      } else {
        await api.createContact(contactData);
        alert("Contact saved successfully");
      }

      refresh();
      clearSelection();
      setForm({
        firstName: "",
        lastName: "",
        addressLine1: "",
        city: "",
        postalCode: "",
        telHome: "",
        telWork: "",
        primaryMobile: "",
        alternateMobile: "",
        email: "",
        countryId: "",
        countryName: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Error saving contact:", err);
      alert("Something went wrong while saving the contact");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{selected ? "Update Contact" : "New Contact"}</h3>

      {/* Name Fields */}
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
      />
      {errors.firstName && <small style={{ color: "red" }}>{errors.firstName}</small>}

      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
      />
      {errors.lastName && <small style={{ color: "red" }}>{errors.lastName}</small>}

      {/* Address Fields */}
      <input
        name="addressLine1"
        placeholder="Address Line 1"
        value={form.addressLine1}
        onChange={handleChange}
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />
      <input
        name="postalCode"
        placeholder="Postal Code"
        value={form.postalCode}
        onChange={handleChange}
      />

      {/* Phone Fields */}
      <input
        name="primaryMobile"
        placeholder="Primary Mobile"
        value={form.primaryMobile}
        onChange={handleChange}
      />
      {errors.primaryMobile && (
        <small style={{ color: "red" }}>{errors.primaryMobile}</small>
      )}

      <input
        name="alternateMobile"
        placeholder="Alternate Mobile"
        value={form.alternateMobile}
        onChange={handleChange}
      />
      <input
        name="telHome"
        placeholder="Home Telephone"
        value={form.telHome}
        onChange={handleChange}
      />
      <input
        name="telWork"
        placeholder="Work Telephone"
        value={form.telWork}
        onChange={handleChange}
      />

      {/* Email */}
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      {/* Country Section */}
      <label style={{ fontSize: "14px", fontWeight: "500" }}>Country</label>
      <select
        name="countryId"
        value={form.countryId}
        onChange={(e) =>
          setForm({ ...form, countryId: e.target.value, countryName: "" })
        }
      >
        <option value="">Select Existing Country</option>
        {countries.map((c) => (
          <option key={c._id} value={c._id}>
            {c.country}
          </option>
        ))}
      </select>

      <div style={{ textAlign: "center", margin: "5px 0" }}>OR</div>

      <input
        name="countryName"
        placeholder="Type new country name"
        value={form.countryName}
        onChange={(e) =>
          setForm({ ...form, countryName: e.target.value, countryId: "" })
        }
      />

      {errors.countryId && (
        <small style={{ color: "red" }}>{errors.countryId}</small>
      )}

      <div style={{ marginTop: "10px" }}>
        <button type="submit">{selected ? "Update" : "Save"}</button>
        <button
          type="button"
          onClick={() => {
            clearSelection();
            setForm({
              firstName: "",
              lastName: "",
              addressLine1: "",
              city: "",
              postalCode: "",
              telHome: "",
              telWork: "",
              primaryMobile: "",
              alternateMobile: "",
              email: "",
              countryId: "",
              countryName: "",
            });
            setErrors({});
          }}
        >
          New
        </button>
      </div>
    </form>
  );
}
