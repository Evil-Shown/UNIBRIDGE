import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { getPortalProfile, savePortalProfile } from '../../services/jobPortalApi';
import '../../styles/jobPortalMySpace.css';

const emptyExperience = { jobTitle: '', companyName: '', employmentType: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' };
const emptyEducation = { title: '', level: '', institution: '', fromDate: '', toDate: '', currentlyStudying: false, projectsInvolved: '' };

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  currentPosition: '',
  gender: '',
  targetJob: { jobTitle: '', desiredLocation: '', contractType: '', remoteWork: '', experienceLevel: '', minimumSalary: '', currency: 'LKR', summary: '' },
  workExperiences: [],
  skills: [],
  languages: [],
  educationItems: [],
  otherAssets: { linkedin: '', github: '', website: '' },
};

export default function JobPortalMySpace() {
  const [form, setForm] = useState(initialForm);
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPortalProfile();
        const data = res.data?.data || {};
        setForm((prev) => ({
          ...prev,
          ...data,
          targetJob: { ...prev.targetJob, ...(data.targetJob || {}) },
          otherAssets: { ...prev.otherAssets, ...(data.otherAssets || {}) },
          workExperiences: data.workExperiences || [],
          skills: data.skills || [],
          languages: data.languages || [],
          educationItems: data.educationItems || [],
        }));
      } catch (_) {
        // first-time profile is expected to be missing
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completion = useMemo(() => {
    const checks = [
      !!form.firstName, !!form.lastName, !!form.email, !!form.phone, !!form.currentPosition,
      !!form.targetJob?.jobTitle, form.workExperiences.length > 0, form.skills.length > 0,
      form.languages.length > 0, form.educationItems.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  const onSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await savePortalProfile(form);
      setMessage('My Space profile saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput('');
  };
  const addLanguage = () => {
    const value = languageInput.trim();
    if (!value || form.languages.includes(value)) return;
    setForm((prev) => ({ ...prev, languages: [...prev.languages, value] }));
    setLanguageInput('');
  };

  if (loading) return <div className="loading">Loading My Space...</div>;

  return (
    <div className="myspace">
      <Link to="/student/job-portal" className="myspace-back"><FaArrowLeft /> Back to Job Portal</Link>
      <div className="myspace-header">
        <h1>My Space</h1>
        <span className="myspace-progress">{completion}% complete</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="myspace-grid">
        <section className="card">
          <h3>Profile</h3>
          <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Current position" value={form.currentPosition} onChange={(e) => setForm({ ...form, currentPosition: e.target.value })} />
        </section>

        <section className="card">
          <h3>Target Job</h3>
          <input placeholder="Desired job title" value={form.targetJob.jobTitle} onChange={(e) => setForm({ ...form, targetJob: { ...form.targetJob, jobTitle: e.target.value } })} />
          <input placeholder="Desired location" value={form.targetJob.desiredLocation} onChange={(e) => setForm({ ...form, targetJob: { ...form.targetJob, desiredLocation: e.target.value } })} />
          <input placeholder="Contract type" value={form.targetJob.contractType} onChange={(e) => setForm({ ...form, targetJob: { ...form.targetJob, contractType: e.target.value } })} />
          <textarea placeholder="Summary" value={form.targetJob.summary} onChange={(e) => setForm({ ...form, targetJob: { ...form.targetJob, summary: e.target.value } })} />
        </section>

        <section className="card wide">
          <h3>Work Experience</h3>
          {form.workExperiences.map((item, idx) => (
            <div className="row" key={idx}>
              <input placeholder="Role" value={item.jobTitle} onChange={(e) => {
                const workExperiences = [...form.workExperiences];
                workExperiences[idx] = { ...item, jobTitle: e.target.value };
                setForm({ ...form, workExperiences });
              }} />
              <input placeholder="Company" value={item.companyName} onChange={(e) => {
                const workExperiences = [...form.workExperiences];
                workExperiences[idx] = { ...item, companyName: e.target.value };
                setForm({ ...form, workExperiences });
              }} />
              <button className="icon-btn" onClick={() => setForm({ ...form, workExperiences: form.workExperiences.filter((_, i) => i !== idx) })}><FaTrash /></button>
            </div>
          ))}
          <button className="btn btn-outline" onClick={() => setForm({ ...form, workExperiences: [...form.workExperiences, emptyExperience] })}><FaPlus /> Add Experience</button>
        </section>

        <section className="card">
          <h3>Skills</h3>
          <div className="row">
            <input placeholder="Add skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
            <button className="btn btn-outline" onClick={addSkill}>Add</button>
          </div>
          <div className="chips">{form.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </section>

        <section className="card">
          <h3>Languages</h3>
          <div className="row">
            <input placeholder="Add language" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} />
            <button className="btn btn-outline" onClick={addLanguage}>Add</button>
          </div>
          <div className="chips">{form.languages.map((l) => <span key={l} className="chip">{l}</span>)}</div>
        </section>

        <section className="card wide">
          <h3>Education</h3>
          {form.educationItems.map((item, idx) => (
            <div className="row" key={idx}>
              <input placeholder="Qualification" value={item.title} onChange={(e) => {
                const educationItems = [...form.educationItems];
                educationItems[idx] = { ...item, title: e.target.value };
                setForm({ ...form, educationItems });
              }} />
              <input placeholder="Institution" value={item.institution} onChange={(e) => {
                const educationItems = [...form.educationItems];
                educationItems[idx] = { ...item, institution: e.target.value };
                setForm({ ...form, educationItems });
              }} />
              <button className="icon-btn" onClick={() => setForm({ ...form, educationItems: form.educationItems.filter((_, i) => i !== idx) })}><FaTrash /></button>
            </div>
          ))}
          <button className="btn btn-outline" onClick={() => setForm({ ...form, educationItems: [...form.educationItems, emptyEducation] })}><FaPlus /> Add Education</button>
        </section>

        <section className="card wide">
          <h3>Other Assets</h3>
          <input placeholder="LinkedIn URL" value={form.otherAssets.linkedin} onChange={(e) => setForm({ ...form, otherAssets: { ...form.otherAssets, linkedin: e.target.value } })} />
          <input placeholder="GitHub URL" value={form.otherAssets.github} onChange={(e) => setForm({ ...form, otherAssets: { ...form.otherAssets, github: e.target.value } })} />
          <input placeholder="Website URL" value={form.otherAssets.website} onChange={(e) => setForm({ ...form, otherAssets: { ...form.otherAssets, website: e.target.value } })} />
        </section>
      </div>

      <div className="myspace-actions">
        <button className="btn btn-primary" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save My Space'}</button>
      </div>
    </div>
  );
}
