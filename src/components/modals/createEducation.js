import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const CreateEducationModal = ({ user, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidate_id: user || "", // Match backend expectation
    degree: "",
    customDegree: "",
    fieldOfStudy: "",
    customFieldOfStudy: "",
    institution: "",
    customInstitution: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const institutions = [
    { id: "1", name: "Mohammed V University", city: "Rabat", type: "Public", foundedYear: 1957, languageOfInstruction: "French, Arabic" },
    { id: "2", name: "Mohammed V University at Souissi", city: "Rabat", type: "Public", foundedYear: 1993, languageOfInstruction: "French, Arabic" },
    { id: "3", name: "Mohammed V University at Agdal", city: "Rabat", type: "Public", foundedYear: 1993, languageOfInstruction: "French, Arabic" },
    { id: "4", name: "Hassan II University of Casablanca", city: "Casablanca", type: "Public", foundedYear: 1975, languageOfInstruction: "French, Arabic" },
    { id: "5", name: "Cadi Ayyad University", city: "Marrakesh", type: "Public", foundedYear: 1978, languageOfInstruction: "French, Arabic" },
    { id: "6", name: "Sidi Mohamed Ben Abdellah University", city: "Fes", type: "Public", foundedYear: 1975, languageOfInstruction: "French, Arabic" },
    { id: "7", name: "University of Al-Karaouine", city: "Fes", type: "Public", foundedYear: 859, languageOfInstruction: "Arabic" },
    { id: "8", name: "Al Akhawayn University", city: "Ifrane", type: "Private", foundedYear: 1995, languageOfInstruction: "English" },
    { id: "9", name: "International University of Rabat", city: "Rabat", type: "Private", foundedYear: 2010, languageOfInstruction: "French, English" },
    { id: "10", name: "University Moulay Ismail", city: "Meknes", type: "Public", foundedYear: 1989, languageOfInstruction: "French, Arabic" },
    { id: "11", name: "Chouaïb Doukkali University", city: "El Jadida", type: "Public", foundedYear: 1985, languageOfInstruction: "French, Arabic" },
    { id: "12", name: "Ibn Tofail University", city: "Kenitra", type: "Public", foundedYear: 1989, languageOfInstruction: "French, Arabic" },
    { id: "13", name: "Hassan II Agriculture and Veterinary Institute", city: "Rabat", type: "Public", foundedYear: 1966, languageOfInstruction: "French, Arabic" },
    { id: "14", name: "Euro-Mediterranean University of Fes", city: "Fes", type: "Private", foundedYear: 2012, languageOfInstruction: "French, English" },
    { id: "15", name: "Mohammed VI Polytechnic University", city: "Benguerir", type: "Private", foundedYear: 2013, languageOfInstruction: "English, French" },
    { id: "16", name: "Mundiapolis University of Casablanca", city: "Casablanca", type: "Private", foundedYear: 2000, languageOfInstruction: "French, English, Spanish" },
    { id: "17", name: "American University of Leadership International Group", city: "Casablanca", type: "Private", foundedYear: 1996, languageOfInstruction: "English" },
    { id: "18", name: "International University of Agadir", city: "Agadir", type: "Private", foundedYear: 2002, languageOfInstruction: "French, English" },
    { id: "19", name: "École Nationale Supérieure d'Électricité et de Mécanique", city: "Casablanca", type: "Public", foundedYear: 1986, languageOfInstruction: "French" },
    { id: "20", name: "École Hassania des Travaux Publics", city: "Casablanca", type: "Public", foundedYear: 1971, languageOfInstruction: "French" },
    { id: "21", name: "National School of Mineral Industry", city: "Rabat", type: "Public", foundedYear: 1972, languageOfInstruction: "French" },
    { id: "22", name: "Institut Supérieur de Commerce et d'Administration des Entreprises", city: "Casablanca", type: "Private", foundedYear: 1989, languageOfInstruction: "French" },
    { id: "23", name: "Dar Loughat", city: "Tetouan", type: "Private", foundedYear: 2004, languageOfInstruction: "Arabic" },
    { id: "24", name: "Abdelmalek Essaadi University", city: "Tetouan", type: "Public", foundedYear: 1989, languageOfInstruction: "French, Arabic" },
    { id: "25", name: "Ibn Zohr University", city: "Agadir", type: "Public", foundedYear: 1989, languageOfInstruction: "French, Arabic" },
    { id: "26", name: "Hassan I University", city: "Settat", type: "Public", foundedYear: 1997, languageOfInstruction: "French, Arabic" },
    { id: "27", name: "Sultan Moulay Slimane University", city: "Beni Mellal", type: "Public", foundedYear: 2007, languageOfInstruction: "French, Arabic" },
    { id: "28", name: "Mohammed VI University of Health Sciences", city: "Casablanca", type: "Private", foundedYear: 2014, languageOfInstruction: "French, English" },
    { id: "29", name: "École Nationale de Commerce et de Gestion", city: "Tanger", type: "Public", foundedYear: 1992, languageOfInstruction: "French" },
    { id: "30", name: "École Nationale des Sciences Appliquées", city: "Marrakesh", type: "Public", foundedYear: 2000, languageOfInstruction: "French" },
    { id: "31", name: "École Supérieure de Technologie", city: "Essaouira", type: "Public", foundedYear: 1995, languageOfInstruction: "French, Arabic" },
    { id: "32", name: "Université Privée de Marrakech", city: "Marrakesh", type: "Private", foundedYear: 2006, languageOfInstruction: "French, English" },
    { id: "33", name: "École Nationale d'Architecture", city: "Rabat", type: "Public", foundedYear: 1980, languageOfInstruction: "French" },
    { id: "34", name: "Institut National des Postes et Télécommunications", city: "Rabat", type: "Public", foundedYear: 1961, languageOfInstruction: "French" },
    { id: "35", name: "École Mohammadia d'Ingénieurs", city: "Rabat", type: "Public", foundedYear: 1959, languageOfInstruction: "French" },
    { id: "36", name: "École Nationale de Commerce et de Gestion", city: "Agadir", type: "Public", foundedYear: 1994, languageOfInstruction: "French" },
    { id: "37", name: "École Nationale des Sciences Appliquées", city: "Fes", type: "Public", foundedYear: 2005, languageOfInstruction: "French" },
    { id: "38", name: "Université Internationale de Casablanca", city: "Casablanca", type: "Private", foundedYear: 2012, languageOfInstruction: "French, English" },
    { id: "39", name: "École Supérieure de Génie Biomédical", city: "Casablanca", type: "Private", foundedYear: 2010, languageOfInstruction: "French" },
    { id: "40", name: "Institut Supérieur d’Ingénierie et des Technologies", city: "Rabat", type: "Private", foundedYear: 2008, languageOfInstruction: "French, English" },
    { id: "41", name: "École Nationale de Commerce et de Gestion", city: "Settat", type: "Public", foundedYear: 1994, languageOfInstruction: "French" },
    { id: "42", name: "École Nationale des Sciences Appliquées", city: "Kenitra", type: "Public", foundedYear: 2008, languageOfInstruction: "French" },
    { id: "43", name: "Université Privée de Fès", city: "Fes", type: "Private", foundedYear: 2004, languageOfInstruction: "French, English" },
    { id: "44", name: "Institut Supérieur de Gestion et de Commerce", city: "Marrakesh", type: "Private", foundedYear: 1998, languageOfInstruction: "French" },
    { id: "45", name: "École Nationale de Commerce et de Gestion", city: "El Jadida", type: "Public", foundedYear: 1996, languageOfInstruction: "French" },
    { id: "46", name: "École Supérieure de Technologie", city: "Safi", type: "Public", foundedYear: 1993, languageOfInstruction: "French, Arabic" },
    { id: "47", name: "Institut National des Beaux-Arts", city: "Tetouan", type: "Public", foundedYear: 1945, languageOfInstruction: "French, Arabic" },
    { id: "48", name: "École Nationale des Sciences Appliquées", city: "Oujda", type: "Public", foundedYear: 2006, languageOfInstruction: "French" },
    { id: "49", name: "Université Al Quaraouiyine", city: "Fes", type: "Public", foundedYear: 1963, languageOfInstruction: "Arabic" },
    { id: "50", name: "Atlas University", city: "Oujda", type: "Private", foundedYear: 2015, languageOfInstruction: "French, English" },
    { id: "51", name: "Sahara Institute of Technology", city: "Laayoune", type: "Public", foundedYear: 2009, languageOfInstruction: "French, Arabic" },
    { id: "52", name: "Medina Business School", city: "Marrakesh", type: "Private", foundedYear: 2018, languageOfInstruction: "English, French" },
    { id: "53", name: "École Supérieure d’Informatique Al Madina", city: "Casablanca", type: "Private", foundedYear: 2011, languageOfInstruction: "French" },
    { id: "54", name: "Imperial University of Meknes", city: "Meknes", type: "Private", foundedYear: 2016, languageOfInstruction: "French, English" },
    { id: "55", name: "École Nationale de Gestion et de Logistique", city: "Tanger", type: "Public", foundedYear: 2007, languageOfInstruction: "French" },
    { id: "56", name: "Rif University", city: "Nador", type: "Public", foundedYear: 2010, languageOfInstruction: "French, Arabic" },
    { id: "57", name: "Oasis Institute of Science and Technology", city: "Errachidia", type: "Public", foundedYear: 2005, languageOfInstruction: "French, Arabic" },
    { id: "58", name: "École Supérieure des Arts et Métiers", city: "Rabat", type: "Private", foundedYear: 2013, languageOfInstruction: "French" },
    { id: "59", name: "Horizon University", city: "Agadir", type: "Private", foundedYear: 2017, languageOfInstruction: "French, English" },
    { id: "60", name: "École Nationale de Technologie et d’Innovation", city: "Dakhla", type: "Public", foundedYear: 2012, languageOfInstruction: "French" },
    { id: "61", name: "Tafilalet University", city: "Errachidia", type: "Public", foundedYear: 2008, languageOfInstruction: "French, Arabic" },
    { id: "62", name: "École Supérieure de Commerce Al Amal", city: "Casablanca", type: "Private", foundedYear: 2009, languageOfInstruction: "French" },
    { id: "63", name: "Université Lumière de Fès", city: "Fes", type: "Private", foundedYear: 2014, languageOfInstruction: "French, English" },
    { id: "64", name: "Atlas Business Academy", city: "Marrakesh", type: "Private", foundedYear: 2016, languageOfInstruction: "English, French" },
    { id: "65", name: "École Nationale des Sciences de l’Environnement", city: "Rabat", type: "Public", foundedYear: 2010, languageOfInstruction: "French" },
    { id: "66", name: "Souss University of Technology", city: "Agadir", type: "Public", foundedYear: 2007, languageOfInstruction: "French, Arabic" },
    { id: "67", name: "École Supérieure de Management Al Hikma", city: "Casablanca", type: "Private", foundedYear: 2012, languageOfInstruction: "French" },
    { id: "68", name: "Université de l’Avenir", city: "Kenitra", type: "Private", foundedYear: 2015, languageOfInstruction: "French, English" },
    { id: "69", name: "École Nationale d’Ingénierie Maritime", city: "Tanger", type: "Public", foundedYear: 2009, languageOfInstruction: "French" },
    { id: "70", name: "Marrakesh International University", city: "Marrakesh", type: "Private", foundedYear: 2018, languageOfInstruction: "English, French" },
    { id: "71", name: "École Supérieure de Technologie Al Wafa", city: "Fes", type: "Public", foundedYear: 2011, languageOfInstruction: "French, Arabic" },
    { id: "72", name: "Université Al Manar", city: "Rabat", type: "Private", foundedYear: 2013, languageOfInstruction: "French, English" },
    { id: "73", name: "École Nationale des Arts et du Design", city: "Casablanca", type: "Public", foundedYear: 2008, languageOfInstruction: "French" },
    { id: "74", name: "Institut Supérieur de Tourisme", city: "Tanger", type: "Private", foundedYear: 2010, languageOfInstruction: "French, English" },
    { id: "75", name: "École Nationale de Commerce Al Irfane", city: "Rabat", type: "Public", foundedYear: 2006, languageOfInstruction: "French" },
    { id: "76", name: "Université de la Paix", city: "Marrakesh", type: "Private", foundedYear: 2017, languageOfInstruction: "French, English" },
    { id: "77", name: "École Supérieure des Sciences Appliquées", city: "Meknes", type: "Public", foundedYear: 2012, languageOfInstruction: "French" },
    { id: "78", name: "Institut Al Andalous de Technologie", city: "Fes", type: "Private", foundedYear: 2014, languageOfInstruction: "French, Arabic" },
    { id: "79", name: "École Nationale de Gestion des Ressources", city: "Agadir", type: "Public", foundedYear: 2009, languageOfInstruction: "French" },
    { id: "80", name: "Université Al Nour", city: "Casablanca", type: "Private", foundedYear: 2016, languageOfInstruction: "French, English" },
    { id: "81", name: "École Supérieure de Logistique", city: "Tanger", type: "Private", foundedYear: 2013, languageOfInstruction: "French" },
    { id: "82", name: "Institut National de l’Innovation", city: "Rabat", type: "Public", foundedYear: 2010, languageOfInstruction: "French" },
    { id: "83", name: "Université Al Baraka", city: "Marrakesh", type: "Private", foundedYear: 2015, languageOfInstruction: "French, English" },
    { id: "84", name: "École Nationale des Sciences Numériques", city: "Casablanca", type: "Public", foundedYear: 2011, languageOfInstruction: "French" },
    { id: "85", name: "Institut Supérieur de Santé Publique", city: "Rabat", type: "Private", foundedYear: 2014, languageOfInstruction: "French, English" },
    { id: "86", name: "École Nationale de Commerce Al Amane", city: "Fes", type: "Public", foundedYear: 2008, languageOfInstruction: "French" },
    { id: "87", name: "Université Al Hikma", city: "Agadir", type: "Private", foundedYear: 2016, languageOfInstruction: "French, English" },
    { id: "88", name: "École Supérieure de Technologie Al Atlas", city: "Marrakesh", type: "Public", foundedYear: 2010, languageOfInstruction: "French, Arabic" },
    { id: "89", name: "Institut National de l’Énergie Renouvelable", city: "Ouarzazate", type: "Public", foundedYear: 2012, languageOfInstruction: "French" },
    { id: "90", name: "Université Al Salam", city: "Tetouan", type: "Private", foundedYear: 2015, languageOfInstruction: "French, English" },
    { id: "91", name: "École Nationale de Gestion des Projets", city: "Casablanca", type: "Public", foundedYear: 2009, languageOfInstruction: "French" },
    { id: "92", name: "Institut Supérieur des Métiers de l’Industrie", city: "Tanger", type: "Private", foundedYear: 2013, languageOfInstruction: "French, English" },
    { id: "93", name: "École Nationale des Arts Traditionnels", city: "Fes", type: "Public", foundedYear: 2010, languageOfInstruction: "French, Arabic" },
    { id: "94", name: "Université Al Karama", city: "Rabat", type: "Private", foundedYear: 2016, languageOfInstruction: "French, English" },
    { id: "95", name: "École Supérieure de Commerce Al Nour", city: "Marrakesh", type: "Private", foundedYear: 2014, languageOfInstruction: "French" },
    { id: "96", name: "Institut National de la Recherche Agricole", city: "Meknes", type: "Public", foundedYear: 2008, languageOfInstruction: "French, Arabic" },
  ];

  const formFields = [
    {
      id: "degree",
      label: "Degree",
      type: "select",
      options: [
        { value: "", label: "Select degree" },
        { value: "High School Diploma", label: "High School Diploma" },
        { value: "Associate Degree", label: "Associate Degree" },
        { value: "Bachelor's Degree", label: "Bachelor's Degree" },
        { value: "Master's Degree", label: "Master's Degree" },
        { value: "Doctorate (PhD)", label: "Doctorate (PhD)" },
        { value: "Professional Certificate", label: "Professional Certificate" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      id: "fieldOfStudy",
      label: "Field of Study",
      type: "select",
      options: [
        { value: "", label: "Select field of study" },
        { value: "Digital Forensics", label: "Digital Forensics" },
        { value: "3D Modeling and Animation", label: "3D Modeling and Animation" },
        { value: "Mobile App Development", label: "Mobile App Development" },
        { value: "Human-Computer Interaction (HCI)", label: "Human-Computer Interaction (HCI)" },
        { value: "Computer Science", label: "Computer Science" },
        { value: "Engineering", label: "Engineering" },
        { value: "Business Administration", label: "Business Administration" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Physics", label: "Physics" },
        { value: "Biology", label: "Biology" },
        { value: "Psychology", label: "Psychology" },
        { value: "Literature", label: "Literature" },
        { value: "Economics", label: "Economics" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      id: "institution",
      label: "Institution",
      type: "select",
      options: [
        { value: "", label: "Select institution" },
        ...institutions.map((inst) => ({ value: inst.id, label: `${inst.name} (${inst.city})` })),
        { value: "Other", label: "Other" },
      ],
    },
    {
      id: "grade",
      label: "Grade",
      type: "select",
      options: [
        { value: "", label: "Select grade" },
        { value: "18-20", label: "18-20 (Excellent)" },
        { value: "16-17.99", label: "16-17.99 (Very Good)" },
        { value: "14-15.99", label: "14-15.99 (Good)" },
        { value: "12-13.99", label: "12-13.99 (Satisfactory)" },
        { value: "10-11.99", label: "10-11.99 (Pass)" },
        { value: "Below 10", label: "Below 10 (Fail)" },
        { value: "Not Applicable", label: "Not Applicable" },
      ],
    },
  ];

  const dateFields = [
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formatDateToDMY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.degree) newErrors.degree = "Degree is required.";
    if (formData.degree === "Other" && !formData.customDegree.trim()) {
      newErrors.customDegree = "Custom degree is required when 'Other' is selected.";
    }
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = "Field of study is required.";
    if (formData.fieldOfStudy === "Other" && !formData.customFieldOfStudy.trim()) {
      newErrors.customFieldOfStudy = "Custom field of study is required when 'Other' is selected.";
    }
    if (!formData.institution) newErrors.institution = "Institution is required.";
    if (formData.institution === "Other" && !formData.customInstitution.trim()) {
      newErrors.customInstitution = "Custom institution is required when 'Other' is selected.";
    }
    if (!formData.grade) newErrors.grade = "Grade is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!formData.candidate_id) {
      setErrors({ general: "User ID is missing. Please log in." });
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("candidate_id", formData.candidate_id);
      formDataToSend.append("degree", formData.degree === "Other" ? formData.customDegree : formData.degree);
      formDataToSend.append("field_of_study", formData.fieldOfStudy === "Other" ? formData.customFieldOfStudy : formData.fieldOfStudy);
      formDataToSend.append("institution_name", formData.institution === "Other" ? formData.customInstitution : institutions.find((inst) => inst.id === formData.institution)?.name || formData.institution);
      formDataToSend.append("start_date", formatDateToDMY(formData.startDate)); // Match backend format
      formDataToSend.append("end_date", formData.endDate ? formatDateToDMY(formData.endDate) : ""); // Match backend format
      formDataToSend.append("grade", formData.grade);
      formDataToSend.append("description", formData.description || "");

      // Log FormData for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await api.post("/api/education", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Success:", response.data.message);
      navigate("/profile");
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to submit education:", error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const newErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          newErrors[key] = apiErrors[key][0];
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error.response?.data?.message || "An error occurred while submitting the form." });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      candidate_id: user || "",
      degree: "",
      customDegree: "",
      fieldOfStudy: "",
      customFieldOfStudy: "",
      institution: "",
      customInstitution: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    });
    setErrors({});
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-semibold">Add New Education</h5>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-gray-700 mb-1">
                {field.label}
              </label>
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[field.id] ? "border-red-500" : "border-gray-300"
                }`}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formData[field.id] === "Other" && (
                <input
                  type="text"
                  name={`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`}
                  value={formData[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`]}
                  onChange={handleChange}
                  placeholder={`Enter custom ${field.label.toLowerCase()}`}
                  className={`w-full px-4 py-2 border mt-2 ${
                    errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`] ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              )}
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
              {errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`custom${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`]}</p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 mb-4">
            {dateFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[field.id] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter any additional details..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {errors.general && (
            <div className="text-red-500 text-sm mb-4">{errors.general}</div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Education
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEducationModal;