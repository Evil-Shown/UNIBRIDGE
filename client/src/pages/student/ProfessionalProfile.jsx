import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEdit, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle, 
  FaTimes, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt,
  FaBuilding, FaEnvelope, FaPhoneAlt, FaBirthdayCake, FaUser, FaPencilAlt,
  FaLinkedin, FaGithub, FaGlobe, FaRegFileAlt, FaBookmark, FaLaptopHouse,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import '../../styles/professionalProfile.css';

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    currentPosition: '',
    gender: '',
    profilePicture: null,
    isAvailable: false,
    targetJob: {},
    workExperiences: [],
    educationItems: [],
    skills: [],
    languages: [],
    otherAssets: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'work', 'education', 'skills', 'languages', 'target', 'headline', 'profile', 'other-assets'
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/uni/students/profile');
      const data = res.data || {};
      // Merge with default values to ensure all fields exist
      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        birthDate: data.birthDate || '',
        currentPosition: data.currentPosition || '',
        gender: data.gender || '',
        profilePicture: data.profilePicture || null,
        isAvailable: data.isAvailable || false,
        targetJob: data.targetJob || {},
        workExperiences: data.workExperiences || [],
        educationItems: data.educationItems || [],
        skills: data.skills || [],
        languages: data.languages || [],
        otherAssets: data.otherAssets || {}
      });
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.put('http://localhost:5000/api/uni/students/profile', data);
      const updatedData = res.data || {};
      // Merge with existing profile to maintain all fields
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updatedData,
        targetJob: updatedData.targetJob || prevProfile.targetJob || {},
        workExperiences: updatedData.workExperiences || prevProfile.workExperiences || [],
        educationItems: updatedData.educationItems || prevProfile.educationItems || [],
        skills: updatedData.skills || prevProfile.skills || [],
        languages: updatedData.languages || prevProfile.languages || [],
        otherAssets: updatedData.otherAssets || prevProfile.otherAssets || {}
      }));
      setSuccess('Profile updated successfully! ✨');
      setTimeout(() => setSuccess(''), 3000);
      setActiveModal(null);
    } catch (err) {
      setError('Update failed. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const checks = [
      Boolean(profile.firstName), Boolean(profile.lastName), Boolean(profile.phone),
      Boolean(profile.birthDate), Boolean(profile.currentPosition), Boolean(profile.gender),
      Boolean(profile.profilePicture), profile.workExperiences?.length > 0, 
      profile.educationItems?.length > 0, profile.skills?.length > 0, profile.languages?.length > 0, 
      Object.values(profile.targetJob || {}).some(v => !!v),
      Object.values(profile.otherAssets || {}).some(v => !!v)
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  if (loading) return <div className="prof-profile-page" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><h2>Loading your professional identity...</h2></div>;
  
  if (error) return <div className="prof-profile-page" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="error-message">{error}</div></div>;

  const completion = calculateCompletion();

  return (
    <div className="prof-profile-page fade-in-up">
      <div className="prof-container">
        {/* Header Section */}
        <section className="prof-header-card">
          <div className="prof-user-info">
            <div className="prof-avatar">
              {profile.profilePicture ? <img src={profile.profilePicture} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Profile" /> : <span>{profile.firstName?.charAt(0) || 'P'}{profile.lastName?.charAt(0) || ''}</span>}
            </div>
            <div className="prof-title-group">
              <h1>{profile.firstName || 'First'} {profile.lastName || 'Last'}</h1>
              <p className="headline-text">
                {profile.currentPosition || 'Profile headline not filled'} 
                <button className="icon-btn-small" style={{border:'none', background:'none', cursor:'pointer', color:'var(--primary)'}} onClick={() => { setActiveModal('profile'); setFormData(profile) }}><FaEdit /></button>
              </p>
              <div className="prof-contact-meta">
                <span><FaEnvelope /> {user?.email || 'Email not set'}</span>
                <span><FaPhoneAlt /> {profile.phone || 'Not filled'}</span>
                <span><FaBirthdayCake /> {profile.birthDate || 'Not filled'}</span>
                <span><FaUser /> {profile.gender ? (profile.gender === 'woman' ? 'Woman' : 'Man') : 'Not filled'}</span>
              </div>
            </div>
          </div>
          
          <div className="prof-status-section">
            <div className="status-toggle-card">
              <div className="status-info">
                <strong>My Status</strong>
                <p>Show you're available for opportunities!</p>
              </div>
              <button 
                className={`status-toggle ${profile.isAvailable ? 'available' : ''}`}
                onClick={() => updateProfile({ isAvailable: !profile.isAvailable })}
              >
                {profile.isAvailable ? 'Available' : 'Not Available'}
              </button>
            </div>
          </div>
        </section>

        <div className="prof-main-layout">
          {/* Sidebar */}
          <aside className="prof-sidebar">
            <div className="completion-card">
              <div className="completion-header">
                <strong>Profile Strength</strong>
                <span>{completion}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completion}%` }}></div>
              </div>
              <p>Track how much of your profile is filled and improve your visibility.</p>
            </div>

            <nav className="prof-nav">
              <button className="prof-nav-item active" onClick={() => navigate('/student/profile/professional')}>Professional Profile</button>
              <button className="prof-nav-item" onClick={() => navigate('/student/job-portal/applications')}>My Applications</button>
              <button className="prof-nav-item" onClick={() => navigate('/student/job-portal/saved')}>Saved Jobs</button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="prof-content">
            {success && (
              <div className="alert-success" style={{
                padding: '15px', 
                background: '#ecfdf5', 
                color: '#059669', 
                borderRadius: '12px', 
                border: '1px solid #10b981', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaCheckCircle /> {success}
              </div>
            )}
            {error && (
              <div className="alert-error" style={{
                padding: '15px', 
                background: '#fef2f2', 
                color: '#dc2626', 
                borderRadius: '12px', 
                border: '1px solid #fca5a5', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaExclamationCircle /> {error}
              </div>
            )}
            
            {/* Target Job */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Target Job</h3>
                  {(!profile.targetJob || !Object.values(profile.targetJob).some(v => !!v)) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('target'); setFormData(profile.targetJob || {}) }}><FaPlus /> Add</button>
              </div>
              <div className="section-body">
                {profile.targetJob?.jobTitle ? (
                  <div className="data-display">
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <strong>{profile.targetJob.jobTitle}</strong>
                        <span style={{color: 'var(--primary)', fontWeight:600}}>{profile.targetJob.contractType || 'Not specified'}</span>
                    </div>
                    <p style={{fontSize:'14px', color:'#64748b'}}>
                      {profile.targetJob.desiredLocation && <><FaMapMarkerAlt /> {profile.targetJob.desiredLocation}</>}
                      {profile.targetJob.minimumSalary && <> • <FaMoneyBillWave /> {profile.targetJob.currency || 'LKR'} {profile.targetJob.minimumSalary}</>}
                    </p>
                    {profile.targetJob.summary && <p style={{marginTop:'12px', fontSize:'14px'}}>{profile.targetJob.summary}</p>}
                  </div>
                ) : <p className="empty-hint">Tell recruiters what kind of roles you are looking for.</p>}
              </div>
            </div>

            {/* Work Experience */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Work Experience</h3>
                  {(!profile.workExperiences || profile.workExperiences.length === 0) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('work'); setFormData({ id: Date.now() }) }}><FaPlus /> Add</button>
              </div>
              <div className="section-body">
                {profile.workExperiences && profile.workExperiences.length > 0 ? profile.workExperiences.map((work, i) => (
                  <div key={work.id || i} className="data-item">
                    <div className="item-header">
                      <strong>{work.jobTitle || 'Job Title'} at {work.companyName || 'Company'}</strong>
                      <span>{work.startDate || 'Start Date'} - {work.currentlyWorking ? 'Present' : work.endDate || 'End Date'}</span>
                    </div>
                    <p>{work.description || 'No description provided'}</p>
                  </div>
                )) : <p className="empty-hint">Highlight your past and current professional roles.</p>}
              </div>
            </div>

            {/* Education */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Education & Qualifications</h3>
                  {(!profile.educationItems || profile.educationItems.length === 0) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('education'); setFormData({ id: Date.now() }) }}><FaPlus /> Add</button>
              </div>
              <div className="section-body">
                {profile.educationItems && profile.educationItems.length > 0 ? profile.educationItems.map((edu, i) => (
                  <div key={edu.id || i} className="data-item">
                    <div className="item-header">
                      <strong>{edu.level || 'Level'} in {edu.title || 'Title'}</strong>
                      <span>{edu.fromDate || 'From Date'} - {edu.currentlyStudying ? 'Present' : edu.toDate || 'To Date'}</span>
                    </div>
                    <p style={{color:'#64748b'}}>{edu.institution || 'Institution'}</p>
                  </div>
                )) : <p className="empty-hint">List your degrees, diplomas, or certificates.</p>}
              </div>
            </div>

            {/* Skills */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Skills & Expertise</h3>
                  {(!profile.skills || profile.skills.length === 0) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('skills'); setFormData({ skills: (profile.skills || []).join(', ') }) }}><FaPlus /> Manage</button>
              </div>
              <div className="section-body">
                <div className="skill-tags">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map(s => <span key={s} className="skill-tag">{s}</span>)
                  ) : (
                    <p className="empty-hint">Showcase your technical and soft skills.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Languages</h3>
                  {(!profile.languages || profile.languages.length === 0) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('languages'); setFormData({ languages: (profile.languages || []).join(', ') }) }}><FaPlus /> Manage</button>
              </div>
              <div className="section-body">
                <div className="skill-tags">
                  {profile.languages && profile.languages.length > 0 ? (
                    profile.languages.map(l => <span key={l} className="skill-tag">{l}</span>)
                  ) : (
                    <p className="empty-hint">Let recruiters know which languages you can use professionally.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Other Assets */}
            <div className="prof-section-card">
              <div className="section-header">
                <div className="title-area">
                  <h3>Other Assets</h3>
                  {(!profile.otherAssets || !Object.values(profile.otherAssets).some(v => !!v)) && <span className="not-started-badge">Not started</span>}
                </div>
                <button className="add-btn" onClick={() => { setActiveModal('other-assets'); setFormData(profile.otherAssets || {}) }}><FaPlus /> Manage</button>
              </div>
              <div className="section-body">
                {profile.otherAssets && Object.values(profile.otherAssets).some(v => !!v) ? (
                  <div className="other-assets-links">
                    {profile.otherAssets.linkedin && (
                      <a href={profile.otherAssets.linkedin} target="_blank" rel="noreferrer" className="asset-link">
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                    {profile.otherAssets.github && (
                      <a href={profile.otherAssets.github} target="_blank" rel="noreferrer" className="asset-link">
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {profile.otherAssets.website && (
                      <a href={profile.otherAssets.website} target="_blank" rel="noreferrer" className="asset-link">
                        <FaGlobe /> Website
                      </a>
                    )}
                  </div>
                ) : <p className="empty-hint">Add links to support and accelerate your applications.</p>}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Detailed Modals */}
      {activeModal && (
        <div className="prof-modal-overlay">
          <div className="prof-modal">
            <div className="modal-header">
              <div>
                <h3>{
                  activeModal === 'target' ? 'Target Job' : 
                  activeModal === 'work' ? 'Work Experience' : 
                  activeModal === 'education' ? 'Education' : 
                  activeModal === 'skills' ? 'Skills & Expertise' :
                  activeModal === 'languages' ? 'Languages' :
                  activeModal === 'profile' ? 'Personal Information' :
                  activeModal === 'other-assets' ? 'Other Assets' :
                  'Profile Meta'
                }</h3>
                <p>{
                  activeModal === 'target' ? 'Tell recruiters more about the kind of job you\'re looking for.' :
                  activeModal === 'work' ? 'Tell recruiters more about your past and current experiences, projects.' :
                  activeModal === 'education' ? 'List your relevant education, training and certificates.' :
                  activeModal === 'skills' ? 'Highlight the skills and expertise that make you unique.' :
                  activeModal === 'languages' ? 'Let recruiters know which languages you can use professionally.' :
                  activeModal === 'profile' ? 'Let recruiters reach out.' :
                  activeModal === 'other-assets' ? 'Add professional links to support and accelerate your applications.' :
                  'Fill in the details below to update your profile.'
                }</p>
              </div>
              <button className="close-btn" onClick={() => setActiveModal(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              {activeModal === 'profile' && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Profile Picture</label>
                    <div className="profile-picture-upload">
                      {formData.profilePicture ? (
                        <div className="profile-picture-preview">
                          <img src={formData.profilePicture} alt="Profile preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%'}} />
                          <div className="profile-picture-actions">
                            <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>Change</button>
                            <button type="button" className="btn-danger" onClick={() => setFormData({...formData, profilePicture: null})}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="profile-picture-empty">
                          <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                            <div className="illustration-box" style={{width: '60px', height: '60px', fontSize: '24px', marginBottom: '10px'}}><FaPlus /></div>
                            <p>Add a file</p>
                            <small>Drag and drop a file here or...</small>
                            <button type="button" className="btn-primary" style={{marginTop:'10px'}}>Choose a file</button>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && file.size <= 4 * 1024 * 1024) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({...formData, profilePicture: reader.result});
                            };
                            reader.readAsDataURL(file);
                          } else {
                            alert('Please select an image file under 4MB');
                          }
                        }}
                      />
                    </div>
                    <small className="form-help">Pick a picture below 4 MB in which you look natural and smile.</small>
                  </div>
                  <div className="form-group full-width">
                    <label>Gender</label>
                    <div className="gender-options">
                      <label className={`radio-option-card ${formData.gender === 'woman' ? 'active' : ''}`} onClick={() => setFormData({...formData, gender: 'woman'})}>
                        <div className="radio-circle"><div className="inner"></div></div>
                        <span>I'm a woman</span>
                      </label>
                      <label className={`radio-option-card ${formData.gender === 'man' ? 'active' : ''}`} onClick={() => setFormData({...formData, gender: 'man'})}>
                        <div className="radio-circle"><div className="inner"></div></div>
                        <span>I'm a man</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group"><label>First Name</label><input type="text" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={user?.email || ''} disabled /></div>
                  <div className="form-group"><label>Phone</label><input type="tel" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                  <div className="form-group"><label>Birth Date</label><input type="date" value={formData.birthDate || ''} onChange={e => setFormData({...formData, birthDate: e.target.value})} /></div>
                  <div className="form-group full-width"><label>Current Position</label><input type="text" placeholder="e.g. Product Designer" value={formData.currentPosition || ''} onChange={e => setFormData({...formData, currentPosition: e.target.value})} /></div>
                </div>
              )}

              {activeModal === 'target' && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Job title <span className="recommended-tag">Recommended</span></label>
                    <input type="text" placeholder="e.g. Product Manager" value={formData.jobTitle || ''} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label>Desired work location <span className="recommended-tag">Recommended</span></label>
                    <input type="text" placeholder="City, region, country" value={formData.desiredLocation || ''} onChange={e => setFormData({...formData, desiredLocation: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Contract type</label>
                    <select value={formData.contractType || ''} onChange={e => setFormData({...formData, contractType: e.target.value})}>
                      <option value="">Select</option>
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Remote work</label>
                    <div className="remote-work-grid">
                      <div className={`remote-option-card ${formData.remoteWork === 'A few days at home' ? 'active' : ''}`} onClick={() => setFormData({...formData, remoteWork: 'A few days at home'})}>
                        <h4>A few days at home</h4>
                        <p>Work mainly in the office but can take some remote days.</p>
                      </div>
                      <div className={`remote-option-card ${formData.remoteWork === 'Occasional remote' ? 'active' : ''}`} onClick={() => setFormData({...formData, remoteWork: 'Occasional remote'})}>
                        <h4>Occasional remote</h4>
                        <p>Can work from home a few days a week.</p>
                      </div>
                      <div className={`remote-option-card ${formData.remoteWork === 'Fully-remote' ? 'active' : ''}`} onClick={() => setFormData({...formData, remoteWork: 'Fully-remote'})}>
                        <h4>Fully-remote</h4>
                        <p>Can work fully from home.</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Level of experience <span className="recommended-tag">Recommended</span></label>
                    <div className="experience-pills">
                      {['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map(lvl => (
                        <div key={lvl} className={`exp-pill ${formData.experienceLevel === lvl ? 'active' : ''}`} onClick={() => setFormData({...formData, experienceLevel: lvl})}>{lvl}</div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Minimum gross salary a month</label>
                    <input type="number" placeholder="Example: 40000" value={formData.minimumSalary || ''} onChange={e => setFormData({...formData, minimumSalary: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select value={formData.currency || 'LKR'} onChange={e => setFormData({...formData, currency: e.target.value})}>
                      <option value="LKR">Sri Lankan Rupee (LKR)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Share what you are looking for with your own words</label>
                    <textarea rows="4" value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Describe your drivers, what you are looking for."></textarea>
                  </div>
                </div>
              )}

              {(activeModal === 'work' || activeModal === 'education') && (
                <div className="list-management-container">
                  <div className="modal-list-manager">
                    {(activeModal === 'work' ? profile.workExperiences : profile.educationItems).length > 0 ? (
                      (activeModal === 'work' ? profile.workExperiences : profile.educationItems).map((item, idx) => (
                        <div key={item.id || idx} className="manager-item">
                          <div className="item-info">
                            <h4>{activeModal === 'work' ? item.jobTitle : item.title}</h4>
                            <p>{activeModal === 'work' ? item.companyName : item.institution}</p>
                          </div>
                          <div className="item-actions">
                            <button className="action-btn delete-btn" onClick={() => {
                              const newList = [...(activeModal === 'work' ? profile.workExperiences : profile.educationItems)];
                              newList.splice(idx, 1);
                              updateProfile({ [activeModal === 'work' ? 'workExperiences' : 'educationItems']: newList });
                            }}><FaTrash /></button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state-container">
                        <div className="illustration-box"><FaBriefcase /></div>
                        <h4>No entries yet</h4>
                        <p>Tell recruiters more about your past and current experiences.</p>
                      </div>
                    )}
                    
                    <button className="add-list-item-btn" onClick={() => setFormData({ id: Date.now(), isAdding: true })}>
                      <FaPlus /> {activeModal === 'work' ? 'Add experience' : 'Add education'}
                    </button>
                  </div>

                  {formData.isAdding && (
                    <div className="form-grid fade-in-up" style={{background:'#f8fafc', padding:'20px', borderRadius:'15px', border:'1px solid #e2e8f0'}}>
                      {activeModal === 'work' ? (
                        <>
                          <div className="form-group full-width"><label>Job title</label><input type="text" placeholder="e.g. Software Engineering Intern" value={formData.jobTitle || ''} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div>
                          <div className="form-group"><label>Company name</label><input type="text" placeholder="e.g. WSO2" value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} /></div>
                          <div className="form-group"><label>Location</label><input type="text" placeholder="e.g. Colombo, Sri Lanka" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                          <div className="form-group"><label>Employment type</label>
                            <select value={formData.employmentType || ''} onChange={e => setFormData({...formData, employmentType: e.target.value})}>
                              <option value="">Select</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Internship">Internship</option>
                              <option value="Contract">Contract</option>
                            </select>
                          </div>
                          <div className="form-group"><label>Start date</label><input type="month" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
                          <div className="form-group"><label>End date</label><input type="month" value={formData.endDate || ''} disabled={formData.currentlyWorking} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
                          <div className="form-group full-width"><label className="checkbox-label"><input type="checkbox" checked={formData.currentlyWorking || false} onChange={e => setFormData({...formData, currentlyWorking: e.target.checked})} /> I currently work here</label></div>
                          <div className="form-group full-width"><label>Description / responsibilities</label><textarea rows="3" placeholder="Briefly describe what you worked on, your responsibilities, etc." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                        </>
                      ) : (
                        <>
                          <div className="form-group full-width"><label>Title</label><input type="text" placeholder="e.g. BSc (Hons) in Computer Science" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                          <div className="form-group"><label>Level</label>
                            <select value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})}>
                              <option value="">Select</option>
                              <option value="Bachelor's">Bachelor's</option>
                              <option value="Master's">Master's</option>
                              <option value="PhD">PhD</option>
                              <option value="Diploma">Diploma</option>
                              <option value="Certificate">Certificate</option>
                            </select>
                          </div>
                          <div className="form-group"><label>University, school or body</label><input type="text" placeholder="e.g. University of Colombo" value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} /></div>
                          <div className="form-group"><label>From</label><input type="month" value={formData.fromDate || ''} onChange={e => setFormData({...formData, fromDate: e.target.value})} /></div>
                          <div className="form-group"><label>To</label><input type="month" value={formData.toDate || ''} disabled={formData.currentlyStudying} onChange={e => setFormData({...formData, toDate: e.target.value})} /></div>
                          <div className="form-group full-width"><label className="checkbox-label"><input type="checkbox" checked={formData.currentlyStudying || false} onChange={e => setFormData({...formData, currentlyStudying: e.target.checked})} /> I'm still studying here</label></div>
                          <div className="form-group full-width"><label>Projects involved</label><textarea rows="3" placeholder="e.g. Final year software engineering project..." value={formData.projectsInvolved || ''} onChange={e => setFormData({...formData, projectsInvolved: e.target.value})}></textarea></div>
                        </>
                      )}
                      <div className="form-footer" style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                        <button className="btn-primary" onClick={() => {
                          const list = activeModal === 'work' ? profile.workExperiences : profile.educationItems;
                          const newItem = { ...formData };
                          delete newItem.isAdding;
                          updateProfile({ [activeModal === 'work' ? 'workExperiences' : 'educationItems']: [...list, newItem] });
                        }}>Add Entry</button>
                        <button className="btn-secondary" onClick={() => setFormData({})}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(activeModal === 'skills' || activeModal === 'languages') && (
                <div className="skills-management">
                  <div className="search-input-wrapper">
                    <FaBriefcase className="search-icon" />
                    <input 
                      type="text" 
                      placeholder={activeModal === 'skills' ? "Search for skills (e.g. Figma)" : "Search for languages (e.g. English)"} 
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const val = e.target.value.trim();
                          const list = profile[activeModal] || [];
                          if (!list.includes(val)) {
                            updateProfile({ [activeModal]: [...list, val] });
                          }
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>

                  <div className="skill-tags" style={{marginBottom: '30px'}}>
                    {profile[activeModal]?.map((item, idx) => (
                      <span key={idx} className="skill-tag">
                        {item}
                        <FaTimes style={{marginLeft:'8px', cursor:'pointer'}} onClick={() => {
                          const list = [...profile[activeModal]];
                          list.splice(idx, 1);
                          updateProfile({ [activeModal]: list });
                        }} />
                      </span>
                    ))}
                  </div>

                  {(!profile[activeModal] || profile[activeModal].length === 0) && (
                    <div className="empty-state-container">
                      <div className="illustration-box">{activeModal === 'skills' ? <FaRegFileAlt /> : <FaGlobe />}</div>
                      <h4>Start building your list</h4>
                      <p>Search and select {activeModal} to add them to your list.</p>
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'other-assets' && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>LinkedIn</label>
                    <input type="url" placeholder="https://www.linkedin.com/in/your-profile" value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label>GitHub</label>
                    <input type="url" placeholder="https://github.com/your-username" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} />
                  </div>
                  <div className="form-group full-width">
                    <label>Website / Portfolio</label>
                    <input type="url" placeholder="https://your-portfolio.com" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setActiveModal(null)}>{activeModal === 'work' || activeModal === 'education' ? 'Close' : 'Cancel'}</button>
              {!(activeModal === 'work' || activeModal === 'education' || activeModal === 'skills' || activeModal === 'languages') && (
                <button className="btn-primary" onClick={() => {
                  if (activeModal === 'profile') {
                    updateProfile({
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      phone: formData.phone,
                      birthDate: formData.birthDate,
                      currentPosition: formData.currentPosition,
                      gender: formData.gender,
                      profilePicture: formData.profilePicture
                    });
                  }
                  else if (activeModal === 'target') updateProfile({ targetJob: formData });
                  else if (activeModal === 'other-assets') updateProfile({ otherAssets: formData });
                }}>Save Changes</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalProfile;
