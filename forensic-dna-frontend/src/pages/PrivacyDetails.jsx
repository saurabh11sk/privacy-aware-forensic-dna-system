// import "../styles/DNADetails.css";
// import LogoutButton from "../components/LogoutButton";
// import { useState } from "react";
// import { submitFeedback } from "../api/feedback";


// function PrivacyDetails() {
//     const [message, setMessage] = useState("");
// const [file, setFile] = useState(null);
// const [loading, setLoading] = useState(false);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!message.trim()) {
//     alert("Message is required");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("module", "privacy"); // important
//   formData.append("message", message);

//   if (file) {
//     formData.append("file", file);
//   }

//   try {
//     setLoading(true);
//     await submitFeedback(formData);
//     alert("Feedback submitted successfully!");
//     setMessage("");
//     setFile(null);
//   } catch (error) {
//     console.error(error);
//     alert("Submission failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="dna-page">
//       <div className="dna-container">
//         <header className="dna-header">
//           <h1>Privacy & Ethics in Forensic DNA Systems</h1>
//           <LogoutButton />
//         </header>

//         {/* INTRO */}
//         <section className="dna-section">
//           <h2>Why Privacy Matters in DNA Systems</h2>
//           <p>
//             DNA contains extremely sensitive genetic information. Unlike passwords
//             or IDs, genetic data cannot be changed. Therefore, forensic systems must
//             ensure strict privacy, limited access, and controlled processing.
//           </p>
//         </section>

//         {/* PRIVACY PRINCIPLES */}
//         <section className="dna-section">
//           <h2>Core Privacy Principles in This Project</h2>
//           <ul>
//             <li><b>Minimal Data Exposure</b> — Only STR loci required for identification are stored.</li>
//             <li><b>No Full Genome Storage</b> — The system does not store full genetic sequences.</li>
//             <li><b>Role-Based Access Control</b> — Only authenticated users can access data.</li>
//             <li><b>Audit Logging</b> — Evidence submissions and matching actions are traceable.</li>
//             <li><b>Secure API Communication</b> — Backend protects endpoints via authentication.</li>
//           </ul>
//         </section>

//         {/* ETHICAL CONSIDERATIONS */}
//         <section className="dna-section">
//           <h2>Ethical Considerations</h2>
//           <p>
//             Forensic DNA databases must balance public safety with individual
//             rights. Ethical challenges include:
//           </p>

//           <ul>
//             <li>Risk of misuse of genetic data</li>
//             <li>Bias in population databases</li>
//             <li>False match probability interpretation</li>
//             <li>Long-term data retention concerns</li>
//           </ul>
//         </section>

//         {/* LEGAL FRAMEWORK */}
//         <section className="dna-section">
//           <h2>Legal & Regulatory Framework</h2>
//           <p>
//             Many countries regulate forensic DNA usage under strict laws.
//             Systems must comply with:
//           </p>

//           <ul>
//             <li>Data protection regulations (e.g., GDPR principles)</li>
//             <li>National forensic laboratory standards</li>
//             <li>Chain-of-custody documentation requirements</li>
//           </ul>
//         </section>

//         {/* HOW THIS PROJECT ADDRESSES PRIVACY */}
//         <section className="dna-section">
//           <h2>How This System Preserves Genetic Privacy</h2>
//           <p>
//             This Privacy-Aware Forensic DNA System is designed to:
//           </p>

//           <ul>
//             <li>Use synthetic STR profiles for testing</li>
//             <li>Avoid storing personally identifiable information with DNA profiles</li>
//             <li>Separate authentication logic from genetic data processing</li>
//             <li>Allow controlled report generation</li>
//           </ul>
//         </section>

//         {/* USER VIEWPOINT */}
//         <section className="dna-section">
//           <h2>Your Ethical Viewpoint</h2>

//           <textarea
//             placeholder="Share your thoughts on privacy, ethics, or improvements..."
//             rows={5}
//           />

//           <input type="file" />

//           <button className="submit-btn">
//             Submit Response
//           </button>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default PrivacyDetails;


import "../styles/DNADetails.css";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import { submitFeedback } from "../api/feedback";

function PrivacyDetails() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    const formData = new FormData();
    formData.append("module", "privacy");
    formData.append("message", message);

    if (file) {
      formData.append("file", file);
    }

    try {
      setLoading(true);
      await submitFeedback(formData);
      alert("Feedback submitted successfully!");
      setMessage("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dna-page">
      <div className="dna-container">
        <header className="dna-header">
          <h1>Privacy & Ethics in Forensic DNA Systems</h1>
          <LogoutButton />
        </header>

        {/* INTRO */}
        <section className="dna-section">
          <h2>Why Privacy Matters in DNA Systems</h2>
          <p>
            DNA contains extremely sensitive genetic information. Unlike passwords
            or IDs, genetic data cannot be changed. Therefore, forensic systems must
            ensure strict privacy, limited access, and controlled processing.
          </p>
        </section>

        {/* PRIVACY PRINCIPLES */}
        <section className="dna-section">
          <h2>Core Privacy Principles in This Project</h2>
          <ul>
            <li><b>Minimal Data Exposure</b> — Only STR loci required for identification are stored.</li>
            <li><b>No Full Genome Storage</b> — The system does not store full genetic sequences.</li>
            <li><b>Role-Based Access Control</b> — Only authenticated users can access data.</li>
            <li><b>Audit Logging</b> — Evidence submissions and matching actions are traceable.</li>
            <li><b>Secure API Communication</b> — Backend protects endpoints via authentication.</li>
          </ul>
        </section>

        {/* ETHICAL CONSIDERATIONS */}
        <section className="dna-section">
          <h2>Ethical Considerations</h2>
          <p>
            Forensic DNA databases must balance public safety with individual
            rights. Ethical challenges include:
          </p>

          <ul>
            <li>Risk of misuse of genetic data</li>
            <li>Bias in population databases</li>
            <li>False match probability interpretation</li>
            <li>Long-term data retention concerns</li>
          </ul>
        </section>

        {/* LEGAL FRAMEWORK */}
        <section className="dna-section">
          <h2>Legal & Regulatory Framework</h2>
          <p>
            Many countries regulate forensic DNA usage under strict laws.
            Systems must comply with:
          </p>

          <ul>
            <li>Data protection regulations (e.g., GDPR principles)</li>
            <li>National forensic laboratory standards</li>
            <li>Chain-of-custody documentation requirements</li>
          </ul>
        </section>

        {/* HOW THIS PROJECT ADDRESSES PRIVACY */}
        <section className="dna-section">
          <h2>How This System Preserves Genetic Privacy</h2>
          <p>
            This Privacy-Aware Forensic DNA System is designed to:
          </p>

          <ul>
            <li>Use synthetic STR profiles for testing</li>
            <li>Avoid storing personally identifiable information with DNA profiles</li>
            <li>Separate authentication logic from genetic data processing</li>
            <li>Allow controlled report generation</li>
          </ul>
        </section>

        {/* USER VIEWPOINT */}
        <section className="dna-section">
          <h2>Your Ethical Viewpoint</h2>

          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Share your thoughts on privacy, ethics, or improvements..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Response"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default PrivacyDetails;

