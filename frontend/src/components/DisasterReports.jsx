import React, { useEffect, useState } from "react";

export default function DisasterReports({ disasterId }) {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/reports/disasters/${disasterId}/reports`
      );
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [disasterId]);

  if (!reports.length) return null;

  return (
    <div className="report-list">
      <h4>🗣 Reports</h4>
      {reports.map((r) => (
        <div key={r.id} className="report-card">
          <p><strong>User:</strong> {r.user_id}</p>
          <p>{r.content}</p>
          {r.image_url && <img src={r.image_url} alt="report" width="100" />}
          <p><em>Status: {r.verification_status}</em></p>
        </div>
      ))}
    </div>
  );
}