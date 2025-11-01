import React, { useState, useEffect } from "react";
import Select from "react-select";
import { api } from "../api/api";

export default function ContactForm({ selected, refresh, clearSelection }) {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    primaryMobile: "",
    alternateMobile: "",
    email: "",
    countryId: "",
    countryName: "", // for adding a new country
  });
  const [errors, setErrors] = useState({});
  const [loadingCountryCreate, setLoadingCountryCreate] = useState(false);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await api.getCountries();
      setCountries(res.data || []);
    } catch (err) {
      console.error("Failed to load countries:", err);
      setCountries([]);
    }
  };

  // When editing contact, fill form
  useEffect(() => {
    if (selected) {
      // ensure we copy only needed fields (avoid unexpected shapes)
      setForm({
        firstName: selected.firstName || "",
        lastName: selected.lastName || "",
        addressLine1: selected.addressLine1 || "",
        addressLine2: selected.addressLine2 || "",
        city: selected.city || "",
        postalCode: selected.postalCode || "",
        primaryMobile: selected.primaryMobile || "",
        alternateMobile: selected.alternateMobile || "",
        email: selected.email || "",
        countryId: selected.countryId && typeof selected.countryId === "object"
          ? selected.countryId._id
          : selected.countryId || "",
        countryName: "",
      });
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName || !form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName || !form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.primaryMobile || !form.primaryMobile.trim()) newErrors.primaryMobile = "Mobile number is required";
    if (!form.countryId && !form.countryName) newErrors.countryId = "Select or add a country";
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
        const typed = (form.countryName || "").trim();
        if (!typed) {
          setErrors((s) => ({ ...s, countryId: "Country name is empty" }));
          return;
        }

        setLoadingCountryCreate(true);
        try {
          const res = await api.createCountry({ country: typed });
          
          const newCountry = (res && (res.data && (res.data.data || res.data))) || res.data || null;
         
          let countryObj = null;
          if (!newCountry) {
            
            countryObj = res.data && res.data.data ? res.data.data : res.data ? res.data : null;
          } else {
           
            if (newCountry.data && typeof newCountry.data === "object") {
              countryObj = newCountry.data;
            } else {
              countryObj = newCountry;
            }
          }

          // final fallback: if api returned res.data.data
          if (!countryObj && res && res.data && res.data.data) countryObj = res.data.data;

          // if still falsey, try res.data itself
          if (!countryObj && res && res.data) countryObj = res.data;

          if (!countryObj || !countryObj._id) {
            console.error("Unexpected createCountry response:", res);
            throw new Error("Invalid response from server when creating country.");
          }

          selectedCountryId = countryObj._id;

          // add to local list and select it
          setCountries((prev) => {
            // avoid duplicate entry if already exists
            if (prev.some((c) => c._id === countryObj._id)) return prev;
            return [...prev, countryObj];
          });
          setForm((f) => ({ ...f, countryId: selectedCountryId, countryName: "" }));
        } catch (err) {
          // If backend responded with 400 or duplicate message, show friendly message
          console.error("Create country failed:", err?.response?.data || err.message || err);
          const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
          setErrors((s) => ({ ...s, countryId: serverMsg || "Failed to create country" }));
          setLoadingCountryCreate(false);
          return;
        } finally {
          setLoadingCountryCreate(false);
        }
      }

      const contactData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        addressLine1: form.addressLine1 || "",
        addressLine2: form.addressLine2 || "",
        city: form.city || "",
        postalCode: form.postalCode || "",
        primaryMobile: form.primaryMobile.trim(),
        alternateMobile: form.alternateMobile || "",
        email: form.email ? form.email.trim() : "",
        countryId: selectedCountryId,
      };

      if (selected && selected._id) {
        await api.updateContact(selected._id, contactData);
        alert("Contact updated successfully");
      } else {
        await api.createContact(contactData);
        alert("Contact saved successfully");
      }

      refresh();
      clearSelection();
      resetForm();
    } catch (err) {
      console.error("Error saving contact:", err);
      // surface server message if available
      const msg = err?.response?.data?.message || err.message || "Something went wrong while saving the contact";
      alert(msg);
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      primaryMobile: "",
      alternateMobile: "",
      email: "",
      countryId: "",
      countryName: "",
    });
    setErrors({});
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
        name="addressLine2"
        placeholder="Address Line 2 (optional)"
        value={form.addressLine2}
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

      {/* Email */}
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      {/* Country Section */}
      <label style={{ fontSize: "14px", fontWeight: "500" }}>Country</label>
      <Select
        options={countries.map((c) => ({ value: c._id, label: c.country }))}
        onChange={(option) =>
          setForm((prev) => ({ ...prev, countryId: option ? option.value : "", countryName: "" }))
        }
        value={
          form.countryId
            ? { value: form.countryId, label: countries.find((c) => c._id === form.countryId)?.country || "" }
            : null
        }
        placeholder="Search or select a country..."
        isClearable
      />

      <div style={{ textAlign: "center", margin: "5px 0" }}>OR</div>

      <input
        name="countryName"
        placeholder="Type new country name"
        value={form.countryName}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, countryName: e.target.value, countryId: "" }))
        }
      />
      {errors.countryId && <small style={{ color: "red" }}>{errors.countryId}</small>}

      <div style={{ marginTop: "10px" }}>
        <button type="submit" disabled={loadingCountryCreate}>
          {loadingCountryCreate ? "Saving..." : (selected ? "Update" : "Save")}
        </button>
        <button
          type="button"
          onClick={() => {
            clearSelection();
            resetForm();
          }}
        >
          New
        </button>
      </div>
    </form>
  );
}
