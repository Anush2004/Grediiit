import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const { name } = useParams();
  const subName = name;
  

  const handleIgnoreClick = async (reportId) => {
    try {
      await axios.patch(`/api/report/${reportId}/status`, { status: 'Ignored' });
    } catch (error) {
      console.log(error);
    }
    Promise.resolve().then(() => {
      window.location.reload();
  })
  };

  const handleDelete= async (reportId) => {
    try {
      await axios.delete(`/api/report/${reportId}/delete`,);
    } catch (error) {
      console.log(error);
    }
    Promise.resolve().then(() => {
      window.location.reload();
  })
  }
  const handleBlock= async (reportId) => {
    try {
       await axios.patch(`/api/report/${reportId}/status`, { status: 'Blocked' });
    } catch (error) {
      console.log(error);
    }
  }

  const isReportIgnored = (reportId) => {
    console.log(reportId);
    const ignoredReport = reports.find(report => report._id === reportId);
    return ignoredReport && ignoredReport.status === 'Ignored';
  };

  const isReportBlocked = (reportId) => {
    console.log(reportId);
    const ignoredReport = reports.find(report => report._id === reportId);
    return ignoredReport && ignoredReport.status === 'Blocked';
  };


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.post(`/api/report/${subName}/reports`);
        setReports(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReports();
  }, [subName]);

  if (!reports) {
    return (
      <>
        Loading....Please give it a minute
      </>
    )
  }

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {reports.length > 0 ? (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="report-item">
              <p>
                <strong>Reported By:</strong> {report.reporter_uname}
              </p>
              <p>
                <strong>Whom we have reported:</strong> {report.reportee_uname}
              </p>
              <p>
                <strong>Concern:</strong> {report.concern}
              </p>
              <p>
                <strong>Text of the Post which is reported:</strong> {report.postID.text}
              </p>
              <div className="report-actions">
                <button className={`ignored ${isReportIgnored(report._id) ? 'active' : ''}`} disabled={isReportIgnored(report._id) || isReportBlocked(report._id)} onClick={() => handleIgnoreClick(report._id)}>Ignore</button>
                <button className="delete" disabled={isReportIgnored(report._id) || isReportBlocked(report._id)} onClick={() => handleDelete(report._id)}>Delete Post</button>
                <button className="block" disabled={isReportIgnored(report._id) || isReportBlocked(report._id)} onClick={() => handleBlock(report._id)}>Block User</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reports yet.</p>
      )}
    </div>
  );
};

export default Reports;
