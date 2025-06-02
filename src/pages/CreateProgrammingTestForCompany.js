import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Save, ArrowLeft, AlertCircle, CheckCircle2, Users, Target, Settings, FileText, Loader2 } from "lucide-react";
import NavbarCompany from "../components/common/navbarCompany";
import { useNavigate } from "react-router";
import Select from "react-select"; 

export default function TestCreationForm() {
  const [formData, setFormData] = useState({
    objective: "",
    prerequisites: "",
    tools_required: "",
    before_answer: "",
    qcm_ids: [],
    company_id: localStorage.getItem("company_id") || "",
    skill_ids: [],
  });
  const [qcms, setQcms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [qcmsRes, companiesRes, skillsRes] = await Promise.all([
          api.get("/api/qcms/company"),
          api.get("/api/companies/company"),
          api.get("/api/skills/company"),
        ]);
        setQcms(Array.isArray(qcmsRes.data) ? qcmsRes.data : []);
        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err.response?.status === 404
            ? "Requested resource not found. Please check the server configuration."
            : "Unable to load the data required for the form."
        );
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert skills and QCMs to react-select options
  const skillOptions = skills.map((skill) => ({
    value: skill.id,
    label: skill.name,
  }));

  const qcmOptions = qcms.map((qcm) => ({
    value: qcm.id,
    label: qcm.question,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_id" && formData.company_id) return; // Prevent changing company_id
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData({ ...formData, skill_ids: selectedIds });
    if (error) setError(null);
  };

  const handleQcmChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData({ ...formData, qcm_ids: selectedIds });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.objective.trim()) {
      setError("The test objective is required.");
      return false;
    }
    if (!formData.company_id) {
      setError("Company ID is missing. Please ensure you are logged in.");
      return false;
    }
    if (!formData.skill_ids.length) {
      setError("Please select at least one skill.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        objective: formData.objective,
        prerequisites: formData.prerequisites || null,
        tools_required: formData.tools_required || null,
        before_answer: formData.before_answer || null,
        company_id: parseInt(formData.company_id),
        skill_id: parseInt(formData.skill_ids[0]),
      };

      // Only add qcm_id if a QCM is selected
      if (formData.qcm_ids.length > 0) {
        submitData.qcm_id = parseInt(formData.qcm_ids[0]);
      }

      const response = await api.post("/api/tests/company/create", submitData);
      console.log("Test created:", response.data);
      setSuccess(true);
      setFormData({
        objective: "",
        prerequisites: "",
        tools_required: "",
        before_answer: "",
        qcm_ids: [],
        company_id: localStorage.getItem("company_id") || "",
        skill_ids: [],
      });
      setTimeout(() => {
        setSuccess(false);
        navigate('/testsList'); // Redirect to tests list after success
      }, 2000);
    } catch (err) {
      console.error("Error while creating the test:", err);
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(", "));
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred while creating the test."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/testsList');
  };

  if (dataLoading) {
    return (
      <>
        <NavbarCompany />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading form data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCompany />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <button
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Back to Tests</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
                  <p className="text-gray-600 mt-1">
                    Set up comprehensive test parameters for candidate evaluation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-green-800 font-medium">Test Created Successfully!</h3>
                <p className="text-green-700 text-sm mt-1">Your test has been saved and is ready for use.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {/* Test Details Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Test Details</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Objective <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="objective"
                      value={formData.objective}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                      placeholder="Describe the main objective and purpose of this test..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prerequisites
                    </label>
                    <textarea
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                      placeholder="List any required knowledge or experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Tools
                    </label>
                    <textarea
                      name="tools_required"
                      value={formData.tools_required}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                      placeholder="Specify tools, software, or resources needed..."
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pre-Test Instructions
                    </label>
                    <textarea
                      name="before_answer"
                      value={formData.before_answer}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                      placeholder="Instructions candidates should read before starting..."
                    />
                  </div>
                </div>
              </div>

              {/* Configuration Section */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Test Configuration</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hidden company_id field */}
                  <input type="hidden" name="company_id" value={formData.company_id} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Select
                        isMulti
                        options={skillOptions}
                        value={skillOptions.filter((option) => formData.skill_ids.includes(option.value))}
                        onChange={handleSkillChange}
                        placeholder="Select skills..."
                        className="w-full text-sm"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "8px",
                            borderColor: "#6c63ff",
                            backgroundColor: "#f3f0fe",
                            boxShadow: "none",
                            "&:hover": { borderColor: "#8a7ae0" },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#e0e7ff",
                            borderRadius: "4px",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "#4b46af",
                            fontWeight: "medium",
                          }),
                          option: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            color: "black",
                            "&:hover": { backgroundColor: "#f3f0fe" },
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Associated QCMs <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Select
                        isMulti
                        options={qcmOptions}
                        value={qcmOptions.filter((option) => formData.qcm_ids.includes(option.value))}
                        onChange={handleQcmChange}
                        placeholder="Select QCMs..."
                        className="w-full text-sm"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "8px",
                            borderColor: "#6c63ff",
                            backgroundColor: "#f3f0fe",
                            boxShadow: "none",
                            "&:hover": { borderColor: "#8a7ae0" },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#e0e7ff",
                            borderRadius: "4px",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "#4b46af",
                            fontWeight: "medium",
                          }),
                          option: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            color: "black",
                            "&:hover": { backgroundColor: "#f3f0fe" },
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Test...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Test
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}