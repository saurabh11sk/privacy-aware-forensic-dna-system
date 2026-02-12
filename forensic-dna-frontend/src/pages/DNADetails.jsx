import "../styles/DNADetails.css";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import { submitFeedback } from "../api/feedback";



function DNADetails() {
    const [showMorePatents, setShowMorePatents] = useState(false);
    const [showMorePapers, setShowMorePapers] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [displayPatents, setDisplayPatents] = useState([
                {
                    title: "US Patent: DNA Identification System",
                    description:
                    "STR-based DNA profiling techniques used for forensic identification and database comparison.",
                    link: "https://patents.google.com/patent/US5454931A",
                },
                {
                    title: "US Patent: Genetic Marker Analysis",
                    description:
                    "Genetic marker comparison methods for forensic identification and large-scale databases.",
                    link: "https://patents.google.com/patent/US20040229295A1",
                },
                ]);

                const [morePatents, setMorePatents] = useState([
                {
                    title: "Forensic DNA Mixture Interpretation",
                    description: "Methods for interpreting mixed DNA samples in forensic cases.",
                    link: "https://patents.google.com/patent/US20100240138A1",
                },
                {
                    title: "DNA Profile Matching Systems",
                    description:
                    "Automated large-scale DNA database comparison techniques.",
                    link: "https://patents.google.com/patent/US20140378623A1",
                },
                ]);
                const [newPatent, setNewPatent] = useState({
                    title: "",
                    description: "",
                    link: "",
                    mode: "display", // "display" | "more"
                    });

                    const addPatent = () => {
                    if (!newPatent.title || !newPatent.link) return;

                    if (newPatent.mode === "display") {
                        // move last displayed to MORE
                        setMorePatents((prev) => [displayPatents[1], ...prev]);

                        // replace display
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

                    const [displayPapers, setDisplayPapers] = useState([
                    {
                        title: "Butler, J.M. (2006)",
                        description:
                        "Forensic DNA Typing — Biology, Technology, and Genetics of STR Markers.",
                        link: "https://www.sciencedirect.com/science/article/pii/S1872497312000924",
                    },
                    {
                        title: "National Research Council (1996)",
                        description:
                        "The Evaluation of Forensic DNA Evidence — legal and scientific standards.",
                        link: "https://nap.nationalacademies.org/catalog/5141",
                    },
                    ]);

                    const [morePapers, setMorePapers] = useState([
                    {
                        title: "Low Template DNA Analysis",
                        description:
                        "Challenges and statistical interpretation of low-quantity DNA samples.",
                        link: "https://pubmed.ncbi.nlm.nih.gov/24683862/",
                    },
                    {
                        title: "Probabilistic Genotyping in Forensics",
                        description:
                        "Statistical models for complex DNA evidence interpretation.",
                        link: "https://pubmed.ncbi.nlm.nih.gov/31253062/",
                    },
                    ]);

                    const handleFeedbackSubmit = async (e) => {
  e.preventDefault();

  if (!feedbackMessage.trim()) {
    alert("Message is required");
    return;
  }

  const formData = new FormData();
  formData.append("module", "dna");   // 🔥 important
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
    <div className="dna-page">
        <div className="dna-container">
                <header className="dna-header">
                    <h1>DNA — Deoxyribonucleic Acid</h1>
                    <LogoutButton />
                </header>

                {/* ===== DNA INTRO ===== */}
                <section className="dna-section">
                    <h1>What is DNA?</h1>
                    <p>
                    DNA (Deoxyribonucleic Acid) is the hereditary material in humans and
                    almost all living organisms. It contains genetic instructions used
                    in growth, development, functioning, and reproduction.
                    </p>
                    <p>
                    In forensic science, DNA is used as a unique biological identifier
                    because no two individuals (except identical twins) share the same
                    DNA profile.
                    </p>
                </section>

                {/* ===== FORENSIC IMPORTANCE ===== */}
               <section className="dna-section">
                    <h2>Relevant Patents</h2>

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


                {/* ===== PATENT REFERENCES ===== */}
                {/* ===== PATENTS ===== */}
                        {/* <section className="dna-section">
                        <h2>Relevant Patents</h2>

                        <div className="reference-grid">
                            
                            <div className="reference-card featured">
                            <h3>US Patent: DNA Identification System</h3>
                            <p>
                                STR-based DNA profiling techniques used for forensic identification
                                and database comparison.
                            </p>
                            <a
                                href="https://patents.google.com/patent/US5454931A"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Patent
                            </a>
                            </div>

                            <div className="reference-card featured">
                            <h3>US Patent: Genetic Marker Analysis</h3>
                            <p>
                                Genetic marker comparison methods for forensic identification
                                and large-scale databases.
                            </p>
                            <a
                                href="https://patents.google.com/patent/US20040229295A1"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Patent
                            </a>
                            </div>
                        </div>

                        <button
                        className="more-btn"
                        onClick={() => setShowMorePatents(!showMorePatents)}
                        >
                        {showMorePatents ? "▲ Hide Patents" : "▼ More Patents"}
                        </button>

                        {showMorePatents && (
                        <ul className="more-list">
                            <li>
                            <b>Forensic DNA Mixture Interpretation</b>
                            <p>Methods for interpreting mixed DNA samples in forensic cases.</p>
                            <a
                                href="https://patents.google.com/patent/US20100240138A1"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Patent
                            </a>
                            </li>

                            <li>
                            <b>DNA Profile Matching Systems</b>
                            <p>Automated large-scale DNA database comparison techniques.</p>
                            <a
                                href="https://patents.google.com/patent/US20140378623A1"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Patent
                            </a>
                            </li>
                        </ul>
                        )}


                        </section> */}


                        <section className="dna-section">
                            <h3>Add Patent</h3>

                            <input
                                placeholder="Patent Title"
                                value={newPatent.title}
                                onChange={(e) =>
                                setNewPatent({ ...newPatent, title: e.target.value })
                                }
                            />

                            <textarea
                                placeholder="Short Description"
                                rows={3}
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


                        {/* ===== RESEARCH PAPERS =====
                        <section className="dna-section">
                        <h2>Research Papers</h2>

                        <div className="reference-grid">
                            <div className="reference-card featured">
                            <h3>Butler, J.M. (2006)</h3>
                            <p>
                                Forensic DNA Typing — Biology, Technology, and Genetics of STR Markers.
                            </p>
                            <a
                                href="https://www.sciencedirect.com/science/article/pii/S1872497312000924"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Read Paper
                            </a>
                            </div>

                            <div className="reference-card featured">
                            <h3>National Research Council (1996)</h3>
                            <p>
                                The Evaluation of Forensic DNA Evidence — legal and scientific standards.
                            </p>
                            <a
                                href="https://nap.nationalacademies.org/catalog/5141"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Read Paper
                            </a>
                            </div>
                        </div>

                        <button
                        className="more-btn"
                        onClick={() => setShowMorePapers(!showMorePapers)}
                        >
                        {showMorePapers ? "▲ Hide Papers" : "▼ More Research Papers"}
                        </button>

                        {showMorePapers && (
                        <ul className="more-list">
                            <li>
                            <b>Low Template DNA Analysis</b>
                            <p>Challenges and statistical interpretation of low-quantity DNA samples.</p>
                            </li>

                            <li>
                            <b>Probabilistic Genotyping in Forensics</b>
                            <p>Use of probabilistic models for complex DNA evidence interpretation.</p>
                            </li>
                        </ul>
                        )}


                        </section> */}


                        <section className="dna-section">
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
                        <section className="dna-section">
                        <h3>Add Research Paper</h3>

                        <input placeholder="Paper Title" />
                        <textarea rows={3} placeholder="Short Description" />
                        <input placeholder="Paper Link" />

                        <select>
                            <option value="display">Display on Top</option>
                            <option value="more">Add to More</option>
                        </select>

                        <button className="submit-btn">Add Paper</button>
                        </section>




                {/* ===== USER VIEWPOINT ===== */}
                {/* <section className="dna-section">
                    <h2>Your Viewpoint / Suggestions</h2>

                    <textarea
                    placeholder="Write your viewpoint, suggestion, or observation..."
                    rows={5}
                    />

                    <input type="file" />

                    <button className="submit-btn">
                    Submit Feedback
                    </button>
                </section> */}
                <section className="dna-section">
                    <h2>Your Viewpoint / Suggestions</h2>

                    <form onSubmit={handleFeedbackSubmit}>
                        <textarea
                        placeholder="Write your viewpoint, suggestion, or observation..."
                        rows={5}
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

export default DNADetails;
