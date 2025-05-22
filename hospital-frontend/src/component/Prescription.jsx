import React, { useState } from "react";

const PrescriptionComponent = ({
  patientData,
  doctorData,
  onSave,
  readOnly = false
}) => {
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", notes: "" }
  ]);
  const [investigations, setInvestigations] = useState("");
  const [advice, setAdvice] = useState("");

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", notes: "" }]);
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleSave = () => {
    const prescriptionData = {
      medications,
      investigations,
      advice,
      date: currentDate
    };

    const formattedPrescription = formatPrescription(prescriptionData);
    onSave(formattedPrescription);
  };

  const formatPrescription = (data) => {
    let prescriptionText = "";

    if (data.medications.length > 0) {
      prescriptionText += "Medications:\n";
      data.medications.forEach((med, index) => {
        prescriptionText += `${index + 1}. ${med.name} ${med.dosage} - ${med.frequency}`;
        if (med.notes) prescriptionText += ` (${med.notes})`;
        prescriptionText += "\n";
      });
    }

    if (data.investigations) {
      prescriptionText += "\nInvestigations:\n";
      prescriptionText += data.investigations + "\n";
    }

    if (data.advice) {
      prescriptionText += "\nAdvice/Referrals:\n";
      prescriptionText += data.advice;
    }

    return prescriptionText;
  };

  const renderSavedPrescription = (prescriptionText) => {
    if (!prescriptionText) return null;

    const lines = prescriptionText.split('\n');
    return lines.map((line, index) => {
      if (line.endsWith(':')) {
        return <h4 key={index} className="font-bold mt-2">{line}</h4>;
      }
      else if (/^\d+\./.test(line)) {
        return <p key={index} className="ml-4">• {line.substring(line.indexOf('.') + 1).trim()}</p>;
      }
      else {
        return <p key={index} className="ml-4">{line}</p>;
      }
    });
  };

  return (
    <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center border-b-2 border-blue-200 pb-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Utkarsha Nursing Home</h2>
        <div className="text-right text-sm text-gray-600">
          <p className="font-medium">Date: {currentDate}</p>
        </div>
      </div>

      {/* Enhanced Patient Information */}
      <div className="border-b border-gray-200 pb-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Patient Information</h3>
        <p className="font-semibold text-lg text-blue-800">{patientData?.name || "Patient Name"}</p>
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div className="flex items-center">
            <span className="font-medium text-gray-600">Age:</span>
            <span className="ml-2">{patientData?.age || "N/A"} years</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600">Gender:</span>
            <span className="ml-2">{patientData?.gender || "N/A"}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-medium text-gray-600">Symptoms:</span>
          <span className="ml-2 text-sm">{patientData?.symptom || "N/A"}</span>
        </div>
      </div>

      {readOnly ? (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full text-white font-bold text-xl">
                ℞
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">Prescription</h3>
              </div>
            </div>
            <div className="p-4 bg-white">
              {renderSavedPrescription(patientData?.prescription)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 shadow-sm mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full text-white font-bold text-xl">
                ℞
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">Prescription</h3>
                <p className="text-sm text-gray-600">Add medications and treatment details</p>
              </div>
            </div>

            {/* Enhanced Medications Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Medications
              </h4>
              
              {medications.map((med, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Medication</label>
                      <input
                        type="text"
                        placeholder="Enter medication name"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                      <input
                        type="text"
                        placeholder="e.g., 500mg"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                      <input
                        type="text"
                        placeholder="e.g., 2 times daily"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                      <input
                        type="text"
                        placeholder="Additional notes"
                        value={med.notes}
                        onChange={(e) => handleMedicationChange(index, "notes", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-center">
                      <button
                        onClick={() => handleRemoveMedication(index)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                        title="Remove medication"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddMedication}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                <span className="text-lg mr-1">+</span>
                Add Medication
              </button>
            </div>

            {/* Enhanced Investigations Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Investigations
              </h4>
              <textarea
                value={investigations}
                onChange={(e) => setInvestigations(e.target.value)}
                placeholder="Enter recommended tests, lab work, imaging studies, etc."
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
              ></textarea>
            </div>

            {/* Enhanced Advice Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Advice & Referrals
              </h4>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Enter medical advice, lifestyle recommendations, follow-up instructions, or referrals"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
              ></textarea>
            </div>

            {/* Enhanced Save Button */}
            <div className="text-right">
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 font-medium shadow-md transition-all duration-200 flex items-center ml-auto"
              >
                <span className="mr-2">💾</span>
                Save Prescription
              </button>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Footer */}
      {readOnly && (
        <div className="mt-8 flex justify-between items-center border-t-2 border-gray-200 pt-4 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
          <div className="text-sm">
            <p className="font-bold text-lg text-blue-900">{doctorData?.name || "Dr. Name"}</p>
            <p className="text-gray-700">{doctorData?.qualification || "MBBS"}</p>
            <p className="text-gray-600">Reg. No: {doctorData?.regNo || "REG/123456"}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg text-2xl flex items-center justify-center shadow-md">
            <span className="font-bold">℞</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionComponent;