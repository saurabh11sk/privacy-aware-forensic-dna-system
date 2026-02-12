import "../styles/MatchingDetails.css";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import { submitFeedback } from "../api/feedback";


function MatchingDetails() {

  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [showMorePatents, setShowMorePatents] = useState(false);
  const [showMorePapers, setShowMorePapers] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackFile, setFeedbackFile] = useState(null);
  const [loading, setLoading] = useState(false);


/* -------- PATENTS -------- */
const [displayPatents, setDisplayPatents] = useState([
  {
    title: "DNA Identification System",
    description: "STR-based forensic identification method.",
    link: "https://patents.google.com/patent/US5454931A",
  },
  {
    title: "Automated DNA Profile Matching",
    description: "Large-scale automated forensic database matching.",
    link: "https://patents.google.com/patent/US20140378623A1",
  },
]);

const [morePatents, setMorePatents] = useState([]);

/* -------- RESEARCH PAPERS -------- */
const [displayPapers, setDisplayPapers] = useState([
  {
    title: "Probabilistic Genotyping in Forensics",
    description: "Statistical interpretation of DNA mixtures.",
    link: "https://pubmed.ncbi.nlm.nih.gov/31253062/",
  },
  {
    title: "Low Template DNA Analysis",
    description: "Challenges in low-quantity forensic DNA samples.",
    link: "https://pubmed.ncbi.nlm.nih.gov/24683862/",
  },
]);

const [morePapers, setMorePapers] = useState([]);
const [newPatent, setNewPatent] = useState({
  title: "",
  description: "",
  link: "",
  mode: "display",
});

const addPatent = () => {
  if (!newPatent.title || !newPatent.link) return;

  if (newPatent.mode === "display") {
    setMorePatents((prev) => [displayPatents[1], ...prev]);
    setDisplayPatents([
      {
        title: newPatent.title,
        description: newPatent.description,
        link: newPatent.link,
      },
      displayPatents[0],
    ]);
  } else {
    setMorePatents((prev) => [
      {
        title: newPatent.title,
        description: newPatent.description,
        link: newPatent.link,
      },
      ...prev,
    ]);
  }

  setNewPatent({ title: "", description: "", link: "", mode: "display" });
};


/* -------- ADD PAPER STATE -------- */
const [newPaper, setNewPaper] = useState({
  title: "",
  description: "",
  link: "",
  mode: "display",
});

const addPaper = () => {
  if (!newPaper.title || !newPaper.link) return;

  if (newPaper.mode === "display") {
    setMorePapers((prev) => [displayPapers[1], ...prev]);

    setDisplayPapers([
      {
        title: newPaper.title,
        description: newPaper.description,
        link: newPaper.link,
      },
      displayPapers[0],
    ]);
  } else {
    setMorePapers((prev) => [
      {
        title: newPaper.title,
        description: newPaper.description,
        link: newPaper.link,
      },
      ...prev,
    ]);
  }

  setNewPaper({ title: "", description: "", link: "", mode: "display" });
};

const handleFeedbackSubmit = async (e) => {
  e.preventDefault();

  if (!feedbackMessage.trim()) {
    alert("Message is required");
    return;
  }

  const formData = new FormData();
  formData.append("module", "matching");   // 🔥 important
  formData.append("message", feedbackMessage);

  if (feedbackFile) {
    formData.append("file", feedbackFile);
  }

  try {
    setLoading(true);
    await submitFeedback(formData);
    alert("Feedback submitted successfully!");
    setFeedbackMessage("");
    setFeedbackFile(null);
  } catch (error) {
    console.error(error);
    alert("Submission failed");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="match-page">
      <div className="match-container">

        <header className="match-header">
          <h1>Forensic DNA Matching System</h1>
          <LogoutButton />
        </header>

        {/* INTRODUCTION */}
        <section className="match-section">
          <h2>What is DNA Matching?</h2>
          <p>
            DNA matching is the process of comparing genetic markers 
            between a submitted evidence sample and stored reference profiles. 
            In forensic systems, this comparison is primarily based on 
            Short Tandem Repeat (STR) loci.
          </p>
        </section>

        {/* HOW OUR SYSTEM WORKS */}
        <section className="match-section">
          <h2>How Our System Performs Matching</h2>
          <ul>
            <li>Extract STR loci from submitted evidence</li>
            <li>Compare allele pairs with stored profiles</li>
            <li>Calculate similarity score</li>
            <li>Interpret confidence level</li>
            <li>Generate forensic report</li>
          </ul>
        </section>

        {/* ALGORITHM EXPLANATION */}
        <section className="match-section">
          <h2>Matching Algorithm Logic</h2>

          <button
            className="toggle-btn"
            onClick={() => setShowAlgorithm(!showAlgorithm)}
          >
            {showAlgorithm ? "▲ Hide Algorithm" : "▼ View Algorithm"}
          </button>

          {showAlgorithm && (
            <div className="algorithm-box">
              <p><strong>Step 1:</strong> For each STR locus, compare allele1 and allele2.</p>
              <p><strong>Step 2:</strong> Assign score for matching allele pairs.</p>
              <p><strong>Step 3:</strong> Normalize score across all loci.</p>
              <p><strong>Step 4:</strong> Convert numeric score into confidence category.</p>

              <pre>
{`score = matched_loci / total_loci

if score >= 0.9:
    confidence = "Very Strong Match"
elif score >= 0.7:
    confidence = "Probable Match"
elif score >= 0.5:
    confidence = "Weak Match"
else:
    confidence = "Unlikely Match"`}
              </pre>
            </div>
          )}
        </section>

        {/* CONFIDENCE INTERPRETATION */}
        <section className="match-section">
          <h2>Confidence Interpretation</h2>
          <p>
            The system translates numerical similarity scores into 
            human-readable forensic interpretations to assist investigators.
          </p>
        </section>

        {/* FUTURE EXTENSIONS */}
        <section className="match-section">
          <h2>Future Improvements</h2>
          <ul>
            <li>Probabilistic genotyping models</li>
            <li>Bayesian statistical framework</li>
            <li>Machine learning assisted confidence scoring</li>
          </ul>
        </section>
        {/* PATENTS */}

{/* <section className="match-section">
  <h2>Related Patents</h2>

  <ul>
    <li>
      <a
        href="https://patents.google.com/patent/US5454931A"
        target="_blank"
        rel="noreferrer"
      >
        DNA Identification System
      </a>
    </li>

    <li>
      <a
        href="https://patents.google.com/patent/US20140378623A1"
        target="_blank"
        rel="noreferrer"
      >
        Automated DNA Profile Matching Systems
      </a>
    </li>
  </ul>
</section> */}

<section className="match-section">
  <h2>Related Patents</h2>

  <div className="reference-grid">
    {displayPatents.map((p, i) => (
      <div className="reference-card" key={i}>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <a href={p.link} target="_blank" rel="noreferrer">
          View Patent
        </a>
      </div>
    ))}
  </div>

  {morePatents.length > 0 && (
    <>
      <button
        className="more-btn"
        onClick={() => setShowMorePatents(!showMorePatents)}
      >
        {showMorePatents ? "▲ Hide Patents" : "▼ More Patents"}
      </button>

      {showMorePatents && (
        <ul className="more-list">
          {morePatents.map((p, i) => (
            <li key={i}>
              <b>{p.title}</b>
              <p>{p.description}</p>
              <a href={p.link} target="_blank" rel="noreferrer">
                View Patent
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</section>

<section className="match-section">
  <h3>Add Patent</h3>

  <input
    placeholder="Patent Title"
    value={newPatent.title}
    onChange={(e) =>
      setNewPatent({ ...newPatent, title: e.target.value })
    }
  />

  <textarea
    rows={3}
    placeholder="Short Description"
    value={newPatent.description}
    onChange={(e) =>
      setNewPatent({ ...newPatent, description: e.target.value })
    }
  />

  <input
    placeholder="Patent Link"
    value={newPatent.link}
    onChange={(e) =>
      setNewPatent({ ...newPatent, link: e.target.value })
    }
  />

  <select
    value={newPatent.mode}
    onChange={(e) =>
      setNewPatent({ ...newPatent, mode: e.target.value })
    }
  >
    <option value="display">Display on Top</option>
    <option value="more">Add to More</option>
  </select>

  <button className="submit-btn" onClick={addPatent}>
    Add Patent
  </button>
</section>


{/* RESEARCH PAPERS */}
{/* <section className="match-section">
  <h2>Research Papers</h2>

  <ul>
    <li>
      <a
        href="https://pubmed.ncbi.nlm.nih.gov/31253062/"
        target="_blank"
        rel="noreferrer"
      >
        Probabilistic Genotyping in Forensic DNA Interpretation
      </a>
    </li>

    <li>
      <a
        href="https://pubmed.ncbi.nlm.nih.gov/24683862/"
        target="_blank"
        rel="noreferrer"
      >
        Low Template DNA Analysis Challenges
      </a>
    </li>
  </ul>
</section> */}

<section className="match-section">
  <h2>Research Papers</h2>

  <div className="reference-grid">
    {displayPapers.map((p, i) => (
      <div className="reference-card" key={i}>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <a href={p.link} target="_blank" rel="noreferrer">
          Read Paper
        </a>
      </div>
    ))}
  </div>

  {morePapers.length > 0 && (
    <>
      <button
        className="more-btn"
        onClick={() => setShowMorePapers(!showMorePapers)}
      >
        {showMorePapers ? "▲ Hide Papers" : "▼ More Research Papers"}
      </button>

      {showMorePapers && (
        <ul className="more-list">
          {morePapers.map((p, i) => (
            <li key={i}>
              <b>{p.title}</b>
              <p>{p.description}</p>
              <a href={p.link} target="_blank" rel="noreferrer">
                Read Paper
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</section>

<section className="match-section">
  <h3>Add Research Paper</h3>

  <input
    placeholder="Paper Title"
    value={newPaper.title}
    onChange={(e) =>
      setNewPaper({ ...newPaper, title: e.target.value })
    }
  />

  <textarea
    rows={3}
    placeholder="Short Description"
    value={newPaper.description}
    onChange={(e) =>
      setNewPaper({ ...newPaper, description: e.target.value })
    }
  />

  <input
    placeholder="Paper Link"
    value={newPaper.link}
    onChange={(e) =>
      setNewPaper({ ...newPaper, link: e.target.value })
    }
  />

  <select
    value={newPaper.mode}
    onChange={(e) =>
      setNewPaper({ ...newPaper, mode: e.target.value })
    }
  >
    <option value="display">Display on Top</option>
    <option value="more">Add to More</option>
  </select>

  <button className="submit-btn" onClick={addPaper}>
    Add Paper
  </button>
</section>


{/* USER FEEDBACK */}
{/* <section className="match-section">
  <h2>Your Feedback</h2>

  <textarea
    rows={5}
    placeholder="Write your thoughts or suggestions about the matching system..."
  />

  <button className="submit-btn">
    Submit Feedback
  </button>
</section> */}

{/* USER FEEDBACK */}
<section className="match-section">
  <h2>Your Feedback</h2>

  <form onSubmit={handleFeedbackSubmit}>
    <textarea
      rows={5}
      placeholder="Write your thoughts or suggestions about the matching system..."
      value={feedbackMessage}
      onChange={(e) => setFeedbackMessage(e.target.value)}
      required
    />

    <input
      type="file"
      onChange={(e) => setFeedbackFile(e.target.files[0])}
    />

    <button type="submit" className="submit-btn" disabled={loading}>
      {loading ? "Submitting..." : "Submit Feedback"}
    </button>
  </form>
</section>



      </div>
    </div>
  );
}

export default MatchingDetails;
