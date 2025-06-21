// frontend/src/components/ReportForm.jsx
import React, { useState } from "react";

export default function ReportForm({ disasterId }) {
  const [form, setForm] = useState({
    user_id: "citizen1", // dummy user
    content: "",
    image_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          disaster_id: disasterId,
        }),
      });

      if (res.ok) {
        alert("✅ Report submitted");
        setForm({ user_id: "citizen1", content: "", image_url: "" });
      } else {
        alert("❌ Error submitting report");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Network/server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <h4>Submit Report</h4>
      <textarea
        name="content"
        rows="2"
        placeholder="Report content"
        value={form.content}
        onChange={handleChange}
        required
      />
      <input
        name="image_url"
        type="url"
        placeholder="Image URL"
        value={form.image_url}
        onChange={handleChange}
        required
      />
      <button type="submit">Send Report</button>
    </form>
  );
}
