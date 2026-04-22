import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get('http://localhost:5000/api/jobs');

      const allJobs = res?.data?.data || [];

      const employerJobs =
        user?.role === 'admin'
          ? allJobs
          : allJobs.filter(
              (job) =>
                String(job.employerId) === String(user?.id)
            );

      setJobs(employerJobs);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to load jobs'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleCloseJob = async (id) => {
    const confirmClose = window.confirm(
      'Are you sure you want to close this listing?'
    );

    if (!confirmClose) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/jobs/${id}/close`
      );

      fetchJobs();
    } catch (err) {
      alert('Failed to close listing');
    }
  };

  const activeJobs = jobs.filter(
    (job) => job.status === 'OPEN'
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === 'CLOSED'
  ).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg,#f8fafc,#eef2ff,#ffffff)',
        padding: '90px 24px 50px',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '42px',
                margin: 0,
                fontWeight: '900',
                color: '#0f172a',
              }}
            >
              Welcome, {user?.name} 👋
            </h1>

            <p
              style={{
                color: '#64748b',
                marginTop: '10px',
              }}
            >
              Manage jobs, applicants and hiring
              activity.
            </p>
          </div>

          <button
            onClick={() =>
              navigate('/employer/jobs/create')
            }
            style={{
              border: 'none',
              padding: '14px 22px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg,#2563eb,#7c3aed)',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer',
              height: 'fit-content',
            }}
          >
            + Create Job
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(240px,1fr))',
            gap: '18px',
            marginBottom: '28px',
          }}
        >
          <Card
            title="Total Jobs"
            value={jobs.length}
            icon="📄"
          />
          <Card
            title="Open Listings"
            value={activeJobs}
            icon="🟢"
          />
          <Card
            title="Closed Listings"
            value={closedJobs}
            icon="🔒"
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '14px',
              borderRadius: '14px',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        {/* Jobs Table */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow:
              '0 20px 45px rgba(0,0,0,0.07)',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '20px',
              color: '#0f172a',
            }}
          >
            Your Job Listings
          </h2>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : jobs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '10px',
                }}
              >
                📭
              </div>
              No job listings yet
            </div>
          ) : (
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#f8fafc',
                    }}
                  >
                    <Th>Job Title</Th>
                    <Th>Deadline</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job._id}
                      style={{
                        borderBottom:
                          '1px solid #e5e7eb',
                      }}
                    >
                      <Td strong>
                        {job.title}
                      </Td>

                      <Td>
                        {job.deadline
                          ? new Date(
                              job.deadline
                            ).toLocaleDateString()
                          : 'N/A'}
                      </Td>

                      <Td>
                        <span
                          style={{
                            padding:
                              '6px 12px',
                            borderRadius:
                              '999px',
                            fontSize:
                              '12px',
                            fontWeight:
                              '700',
                            background:
                              job.status ===
                              'OPEN'
                                ? '#dcfce7'
                                : '#fee2e2',
                            color:
                              job.status ===
                              'OPEN'
                                ? '#166534'
                                : '#991b1b',
                          }}
                        >
                          {job.status}
                        </span>
                      </Td>

                      <Td>
                        <div
                          style={{
                            display:
                              'flex',
                            gap: '8px',
                            flexWrap:
                              'wrap',
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate(
                                `/employer/jobs/${job._id}/applicants`,
                                {
                                  state:
                                    job,
                                }
                              )
                            }
                            style={
                              smallBtn
                            }
                          >
                            Applicants
                          </button>

                          {job.status ===
                            'OPEN' && (
                            <button
                              onClick={() =>
                                handleCloseJob(
                                  job._id
                                )
                              }
                              style={{
                                ...smallBtn,
                                background:
                                  '#ef4444',
                                color:
                                  '#fff',
                                border:
                                  'none',
                              }}
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({
  title,
  value,
  icon,
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '22px',
      padding: '24px',
      boxShadow:
        '0 10px 25px rgba(0,0,0,.06)',
    }}
  >
    <div
      style={{
        fontSize: '28px',
      }}
    >
      {icon}
    </div>

    <h3
      style={{
        fontSize: '34px',
        margin: '10px 0 6px',
        color: '#0f172a',
      }}
    >
      {value}
    </h3>

    <p
      style={{
        margin: 0,
        color: '#64748b',
        fontWeight: '600',
      }}
    >
      {title}
    </p>
  </div>
);

const Th = ({ children }) => (
  <th
    style={{
      textAlign: 'left',
      padding: '14px',
      color: '#64748b',
      fontSize: '13px',
    }}
  >
    {children}
  </th>
);

const Td = ({
  children,
  strong,
}) => (
  <td
    style={{
      padding: '14px',
      color: '#334155',
      fontWeight: strong
        ? '700'
        : '500',
    }}
  >
    {children}
  </td>
);

const smallBtn = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #dbeafe',
  background: '#eff6ff',
  color: '#1d4ed8',
  fontWeight: '700',
  cursor: 'pointer',
};

export default EmployerDashboard;