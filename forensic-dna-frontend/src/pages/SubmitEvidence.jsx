import { useEffect, useState } from "react";
import api from "../api/api";
import LogoutButton from "../components/LogoutButton";

function SubmitEvidence() {
  const [populations, setPopulations] = useState([]);
  const [loci, setLoci] = useState([]);
  const [population, setPopulation] = useState("");
  const [genotypes, setGenotypes] = useState({});
  const [message, setMessage] = useState("");

  // Fetch populations & loci
//   useEffect(() => {
//     api.get("/populations").then((res) => setPopulations(res.data));
//     api.get("/loci").then((res) => setLoci(res.data));
//   }, []);

useEffect(() => {
  api.get("/populations").then((res) => {
    console.log("Populations API:", res.data);
    setPopulations(res.data);
  });

  api.get("/loci").then((res) => {
    console.log("Loci API:", res.data);
    setLoci(res.data);
  });
}, []);


  const handleGenotypeChange = (locus, value) => {
    setGenotypes({ ...genotypes, [locus]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

//     try {
//       await api.post("/evidence", {
//         population,
//         genotypes,
//       });

//       setMessage("Evidence submitted successfully");
//       setPopulation("");
//       setGenotypes({});
//     } catch (err) {
//       setMessage("Error submitting evidence");
//     }
//   };
            try {
                // 🔧 Convert genotypes object → list (backend-compatible)
                const genotypeList = Object.entries(genotypes)
                .filter(([_, value]) => value && value.includes(","))
                .map(([locus, value]) => {
                    const [allele1, allele2] = value.split(",").map(v => v.trim());
                    return {
                    locus,
                    allele1,
                    allele2,
                    };
                });

                await api.post("/evidence", {
                population,
                genotypes: genotypeList,
                });

                setMessage("Evidence submitted successfully");
                setPopulation("");
                setGenotypes({});
            } catch (err) {
                console.error(err);
                setMessage("Error submitting evidence");
            }
            };

  return (
    <div style={{ padding: 40 }}>
      <LogoutButton />
      <h2>Submit DNA Evidence</h2>

      <form onSubmit={handleSubmit}>
        {/* Population
        <label>Population</label>
        <select
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          required
          style={{ display: "block", marginBottom: 20, padding: 8 }}
        >
          <option value="">Select population</option>
          {populations.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select> */}

        <select
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            required
            style={{ display: "block", marginBottom: 20, padding: 8 }}
            >
            <option value="">Select population</option>

            {populations.map((p) => (
                <option key={p.id} value={p.id}>
                {p.name}
                </option>
            ))}
            </select>


        {/* STR Loci */}
        <h4>STR Genotypes</h4>
        {/* {loci.map((locus) => (
          <div key={locus} style={{ marginBottom: 10 }}>
            <label>{locus}</label>
            <input
              type="text"
              placeholder="e.g. 12,14"
              value={genotypes[locus] || ""}
              onChange={(e) =>
                handleGenotypeChange(locus, e.target.value)
              }
              style={{ marginLeft: 10, padding: 6 }}
            />
          </div>
        ))} */}

        {loci.map((l) => (
        <div key={l.id} style={{ marginBottom: 10 }}>
            <label>{l.locus}</label>
            <input
            type="text"
            placeholder="e.g. 12,14"
            value={genotypes[l.locus] || ""}
            onChange={(e) =>
                setGenotypes({
                ...genotypes,
                [l.locus]: e.target.value,
                })
            }
            style={{ marginLeft: 10, padding: 6 }}
            />
        </div>
        ))}


        <button style={{ marginTop: 20, padding: 10 }}>
          Submit Evidence
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default SubmitEvidence;
