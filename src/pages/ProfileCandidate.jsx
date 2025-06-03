import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import AddLanguageModal from "../components/modals/AddLanguage";
import Bio from "../components/modals/AddBioCandidate";
import CreateExperienceModal from "../components/modals/createExperience";
import ModalSkill from "../components/modals/createSkillsCandidate";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
import CreateFormationModal from "../components/modals/createEducation";
import NoProfilePrompt from "../layouts/noProfileCandidate"; 
import {FaPlus} from "react-icons/fa"

export default function ProfileCandidate() {
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [error, setError] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEducationModal, setEducationModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
        if (!candidate_id) {
          throw new Error("Candidate ID not found in localStorage");
        }

        const profileResponse = await api.get(`/api/candidate/${candidate_id}`);
        setCandidateInfo(profileResponse.data);

        const expResponse = await api.get(`/api/experiences/candidate/${candidate_id}`);
        setExperiences(expResponse.data);

        const skillsResponse = await api.get(`/api/skills/candidate/${candidate_id}`);
        setSkills(skillsResponse.data);

        const educationResponse = await api.get(`/api/education/candidate/${candidate_id}`);
        setEducation(educationResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("There was an error loading your profile. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleDownloadCV = async (id) => {
    try {
      await api.get("/api/sanctum/csrf-cookie", { withCredentials: true });
      window.open(`https://skill-match-be.vercel.app/api/candidate/CV/${id}`, "_blank");
    } catch (error) {
      console.error("Error fetching CV:", error);
    }
  };

  if (!candidateInfo && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg shadow-md mx-auto max-w-2xl mt-8">
          <p className="text-base font-medium text-red-700">{error}</p>
        </div>
      </>
    );
  }

  if (candidateInfo && !candidateInfo.profile) {
    return (
      <>
        <NavbarCandidate />
        <NoProfilePrompt />
      </>
    );
  }

  const { name, created_at, email, id } = candidateInfo;
  const { field, phoneNumber, localisation, photoProfil, description } = candidateInfo.profile;

  return (
    <>
      <NavbarCandidate />
   
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-500 mt-2">Step 2: Complete Your Profile</p>
        </div>
        
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="relative bg-gradient-to-r from-indigo-700 to-blue-500 h-32"></div>
          <div className="relative px-5 pb-4 -mt-13">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
                  alt="User profile"
                  src={
                    photoProfil
                      ? `https://skill-match-be.vercel.app/storage/${photoProfil}`
                      : "/assets/default-avatar.png"
                  }
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                  <img
                    className="w-5 h-5 object-contain"
                    alt="Certification badge"
                    src="/assets/guarantee.png"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{field}</p>
                <p className="text-sm text-gray-600">{localisation}</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() => handleDownloadCV(id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300"
                  >
                    Download Resume
                  </button>
                  <span className="bg-blue-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                    Certified Professional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Sidebar (Left) */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            {/* Bio */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
                <Bio />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description || "Add a bio to tell your story."}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Info</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Email:</span> {email}</p>
                <p><span className="font-medium text-gray-800">Phone:</span> {phoneNumber}</p>
                <p><span className="font-medium text-gray-800">Joined:</span>{" "}
                  {new Date(created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
                <AddLanguageModal />
              </div>
              <div className="space-y-2">
                {Array.isArray(candidateInfo.languages) && candidateInfo.languages.length > 0 ? (
                  candidateInfo.languages.map((language, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {language.language}: <span className="text-gray-600">{language.level}</span>
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Add your first language to showcase your skills.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content (Right) */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
            {/* Experiences */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Experiences</h2>
                <CreateExperienceModal user={candidateInfo.id} />
              </div>
              <div className="space-y-4">
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-indigo-600 pl-4">
                      <h3 className="text-base font-semibold text-gray-900">{exp.experience}</h3>
                      <p className="text-sm text-gray-700 font-medium">{exp.role} at {exp.employement_type}</p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(exp.start_date).toLocaleDateString()} -{" "}
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                      </p>
                      {exp.description && (
                        <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Share your experiences to build a stronger profile.</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={() => setShowSkillModal(true)}
                  className="flex text-indigo-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
             <FaPlus />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {skills && skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <div key={index} className="border-l-2 border-indigo-600 pl-4">
                      <h3 className="text-base font-semibold text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-700 font-medium">{skill.level} at {skill.type}</p>
                      <p className="text-sm text-gray-500">{skill.usageFrequency}</p>
                      {skill.classement && (
                        <p className="mt-1 text-sm text-gray-600">{skill.classement}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Share your skills to improve your visibility to companies.</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                <button
                  onClick={() => setEducationModal(true)}
                  className= "flex align-middle text-indigo-600 hover:text-blue-700 text-sm font-medium"
                >
                 <FaPlus />Add
                </button>
              </div>
              <div className="space-y-4">
                {education && education.length > 0 ? (
                  education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-indigo-600 pl-4">
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-700 font-medium">{edu.field_of_study} at {edu.institution_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(edu.start_date).toLocaleDateString()} -{" "}
                        {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : "Present"}
                      </p>
                      {edu.grade && (
                        <p className="mt-1 text-sm text-gray-600">Grade: {edu.grade}</p>
                      )}
                      {edu.description && (
                        <p className="mt-1 text-sm text-gray-600">{edu.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Add your education details to enhance your profile.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {showSkillModal && (
          <ModalSkill
            user={candidateInfo.id}
            onClose={() => {
              setShowSkillModal(false);
              if (candidateInfo && candidateInfo.id) {
                api
                  .get(`/api/skills/candidate/${candidateInfo.id}`)
                  .then((response) => {
                    setSkills(response.data);
                  })
                  .catch((err) => {
                    console.error("Failed to refresh skills", err);
                  });
              }
            }}
          />
        )}
        
        {showEducationModal && (
          <CreateFormationModal
            user={candidateInfo.id}
            onClose={() => {
              setEducationModal(false);
              if (candidateInfo && candidateInfo.id) {
                api
                  .get(`/api/education/candidate/${candidateInfo.id}`)
                  .then((response) => {
                    setEducation(response.data);
                  })
                  .catch((err) => {
                    console.error("Failed to refresh education", err);
                  });
              }
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
}