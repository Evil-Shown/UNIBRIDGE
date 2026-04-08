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
                          <div className="upload-placeholder">
                            <p>Add a file</p>
                            <small>Drag and drop a file here or...</small>
                            <button type="button" className="btn-primary" onClick={() => fileInputRef.current?.click()}>Choose a file</button>
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
                      <label className="radio-option">
                        <input type="radio" name="gender" value="woman" checked={formData.gender === 'woman'} onChange={e => setFormData({...formData, gender: e.target.value})} />
                        <span>I'm a woman</span>
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="gender" value="man" checked={formData.gender === 'man'} onChange={e => setFormData({...formData, gender: e.target.value})} />
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
                  <div className="form-group full-width"><label>Job Title</label><input type="text" value={formData.jobTitle || ''} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div>
                  <div className="form-group"><label>Desired Location</label><input type="text" value={formData.desiredLocation || ''} onChange={e => setFormData({...formData, desiredLocation: e.target.value})} /></div>
                  <div className="form-group"><label>Contract Type</label><select value={formData.contractType || ''} onChange={e => setFormData({...formData, contractType: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select></div>
                  <div className="form-group"><label>Remote Work</label><select value={formData.remoteWork || ''} onChange={e => setFormData({...formData, remoteWork: e.target.value})}>
                    <option value="">Select</option>
                    <option value="A few days at home">A few days at home</option>
                    <option value="Occasional remote">Occasional remote</option>
                    <option value="Fully-remote">Fully-remote</option>
                  </select></div>
                  <div className="form-group"><label>Experience Level</label><select value={formData.experienceLevel || ''} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
                    <option value="">Select</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select></div>
                  <div className="form-group"><label>Salary Currency</label><select value={formData.currency || 'LKR'} onChange={e => setFormData({...formData, currency: e.target.value})}><option value="LKR">LKR</option><option value="USD">USD</option></select></div>
                  <div className="form-group"><label>Minimum Salary</label><input type="number" value={formData.minimumSalary || ''} onChange={e => setFormData({...formData, minimumSalary: e.target.value})} /></div>
                  <div className="form-group full-width"><label>Summary</label><textarea rows="4" value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Describe your drivers, what you are looking for."></textarea></div>
                </div>
              )}
              {activeModal === 'work' && (
                <div className="form-grid">
                  <div className="form-group"><label>Job Title</label><input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div>
                  <div className="form-group"><label>Company Name</label><input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} /></div>
                  <div className="form-group"><label>Start Date</label><input type="month" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
                  <div className="form-group"><label>End Date</label><input type="month" disabled={formData.currentlyWorking} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
                  <div className="form-group full-width"><label><input type="checkbox" checked={formData.currentlyWorking} onChange={e => setFormData({...formData, currentlyWorking: e.target.checked})} /> I currently work here</label></div>
                  <div className="form-group full-width"><label>Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                </div>
              )}
              {activeModal === 'education' && (
                <div className="form-grid">
                  <div className="form-group"><label>Degree/Level</label><input type="text" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} /></div>
                  <div className="form-group"><label>Field of Study</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                  <div className="form-group full-width"><label>Institution</label><input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} /></div>
                  <div className="form-group"><label>From Date</label><input type="month" value={formData.fromDate} onChange={e => setFormData({...formData, fromDate: e.target.value})} /></div>
                  <div className="form-group"><label>To Date</label><input type="month" disabled={formData.currentlyStudying} value={formData.toDate} onChange={e => setFormData({...formData, toDate: e.target.value})} /></div>
                  <div className="form-group full-width"><label><input type="checkbox" checked={formData.currentlyStudying} onChange={e => setFormData({...formData, currentlyStudying: e.target.checked})} /> I am currently studying here</label></div>
                </div>
              )}
              {activeModal === 'skills' && (
                <div className="form-group full-width">
                  <label>Skills (comma separated)</label>
                  <textarea rows="4" value={formData.skills} onChange={e => setFormData({ skills: e.target.value })}></textarea>
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
              {activeModal === 'languages' && (
                <div className="form-group full-width">
                  <label>Languages (comma separated)</label>
                  <textarea rows="4" value={formData.languages || ''} onChange={e => setFormData({ languages: e.target.value })} placeholder="Example: English, Sinhala, Tamil"></textarea>
                </div>
              )}
              {activeModal === 'headline' && (
                <div className="form-group full-width">
                  <label>Professional Headline</label>
                  <input type="text" value={formData.currentPosition} onChange={e => setFormData({ currentPosition: e.target.value })} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
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
                else if (activeModal === 'work') updateProfile({ workExperiences: [...(profile.workExperiences || []), formData] });
                else if (activeModal === 'education') updateProfile({ educationItems: [...(profile.educationItems || []), formData] });
                else if (activeModal === 'skills') updateProfile({ skills: formData.skills.split(',').map(s => s.trim()) });
                else if (activeModal === 'languages') updateProfile({ languages: formData.languages.split(',').map(l => l.trim()) });
                else if (activeModal === 'other-assets') updateProfile({ otherAssets: formData });
                else if (activeModal === 'headline') updateProfile({ currentPosition: formData.currentPosition });
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalProfile;
