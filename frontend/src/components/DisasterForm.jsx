import React, { useState } from "react";

export default function DisasterForm() {
  const [form, setForm] = useState({
    title: "",
    location_name: "",
    description: "",
    tags: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/disasters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Disaster submitted:\n" + JSON.stringify(data, null, 2));
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Server error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🚨 Disaster Reporting Form</h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Disaster Title"
      />

      <input
        type="text"
        name="location_name"
        value={form.location_name}
        onChange={handleChange}
        placeholder="Location Name"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        type="text"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated)"
      />

      <button type="submit">Submit</button>
    </form>
  );
}



