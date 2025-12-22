// ResumeBuilder.jsx
import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumeBuilder.css";

// --- TEMPLATE DEFINITIONS ---
const TEMPLATE_LIST = [
  ...[1, 2, 3, 4].map((n) => ({ id: `executive-${n}`, label: `Executive ${n}`, category: "Executive" })),
  ...[1, 2, 3, 4].map((n) => ({ id: `minimalist-${n}`, label: `Minimalist ${n}`, category: "Minimalist" })),
  ...[1, 2, 3, 4].map((n) => ({ id: `creative-${n}`, label: `Creative ${n}`, category: "Creative" })),
];

// --- SECTION KEYS (Prevents undefined errors) ---
const SECTION_KEYS = ["global", "header", "objective", "summary", "experience", "education", "skills", "certifications", "projects", "hobbies", "languages", "declaration"];

// --- DEFAULT STYLES ---
const DEFAULT_STYLE = {
  fontFamily: "Arial, sans-serif",
  fontSize: 16, // INCREASED FONT SIZE from 14 to 16
  bold: false,
  italic: false,
  align: "left",
  bullet: "solid",
  divider: "solid",
};

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("creative-4");
  const [selectedSection, setSelectedSection] = useState("global");
  const [activeTab, setActiveTab] = useState("data");

  // --- ORDER & VISIBILITY STATE ---
  const [sectionOrder, setSectionOrder] = useState([
    { id: "objective", label: "Career Objective", enabled: true },
    { id: "summary", label: "Professional Summary", enabled: true },
    { id: "experience", label: "Experience", enabled: true },
    { id: "projects", label: "Projects", enabled: true },
    { id: "education", label: "Education", enabled: true },
    { id: "certifications", label: "Certifications", enabled: true },
    { id: "skills", label: "Skills", enabled: true },
    { id: "hobbies", label: "Hobbies", enabled: true },
    { id: "languages", label: "Languages", enabled: true },
    { id: "declaration", label: "Declaration", enabled: true },
  ]);

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: "Jane Doe",
    title: "Product Manager",
    email: "jane@example.com",
    phone: "+1 555 555 5555",
    linkedin: "linkedin.com/in/janedoe",
    website: "janedoe.com",
    address: "New York, USA",
    objective: "To obtain a challenging position that utilizes my skills and experience.",
    summary: "Product leader who drives growth through user-centered roadmaps and data-driven decision making.",
    experience: [
      {
        company: "Acme Inc.",
        role: "Senior PM",
        start: "Jan 2020",
        end: "Present",
        location: "New York, NY",
        description: "Led cross-functional teams; launched feature X; improved retention by 20%.",
      },
    ],
    education: [{ school: "State University", degree: "B.S. Computer Science", year: "2016", grade: "3.8 GPA" }],
    skills: "Product Strategy, Analytics, SQL, Leadership",
    certifications: [
      { name: "PMP Certification", issuer: "PMI", year: "2021", link: "" }
    ],
    projects: [
      { name: "E-Commerce App", description: "Built a React Native app with 10k downloads." }
    ],
    hobbies: "Reading, Traveling, Chess",
    languages: "English, Spanish",
    declaration: "I hereby declare that the above information is true to the best of my knowledge.",
    // image support (dataURL)
    image: null,
  });

  const [styles, setStyles] = useState(() => {
    const obj = {};
    SECTION_KEYS.forEach((k) => (obj[k] = { ...DEFAULT_STYLE }));
    return obj;
  });

  const resumeRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- ACTIONS ---
  const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const setArrayField = (section, index, field, value) => {
    setFormData((prev) => {
      const copy = { ...prev };
      copy[section] = copy[section].map((it, i) => (i === index ? { ...it, [field]: value } : it));
      return copy;
    });
  };

  const addArrayItem = (section) => {
    setFormData((prev) => {
      const c = { ...prev };
      const item = section === "experience"
        ? { company: "", role: "", start: "", end: "", description: "", location: "" }
        : section === "education"
          ? { school: "", degree: "", year: "", grade: "" }
          : section === "projects"
            ? { name: "", description: "" }
            : { name: "", issuer: "", year: "", link: "" };
      c[section] = [...c[section], item];
      return c;
    });
  };

  const removeArrayItem = (section, idx) => {
    setFormData((prev) => {
      const c = { ...prev };
      c[section] = c[section].filter((_, i) => i !== idx);
      return c;
    });
  };

  const moveSection = (idx, dir) => {
    const newOrder = [...sectionOrder];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setSectionOrder(newOrder);
  };

  const toggleSection = (id) => {
    setSectionOrder(prev => prev.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateStyle = (key, value) =>
    setStyles((prev) => ({ ...prev, [selectedSection]: { ...prev[selectedSection], [key]: value } }));

  const inlineFrom = (key) => {
    const s = styles[key] || styles.global || DEFAULT_STYLE;
    return {
      fontFamily: s.fontFamily,
      fontSize: `${s.fontSize}px`,
      fontWeight: s.bold ? 700 : 400,
      fontStyle: s.italic ? "italic" : "normal",
      textAlign: s.align,
      color: "inherit",
      lineHeight: 1.5,
    };
  };

  // --- IMAGE HANDLING ---
  const handleImageUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(f);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderImage = (opts = {}) => {
    const size = opts.size || 100;
    if (formData.image) {
      return <img src={formData.image} alt="profile" style={{ width: size, height: size, objectFit: 'cover', borderRadius: opts.round ? '50%' : '6px', display: 'block' }} />;
    }
    // placeholder
    return <div style={{ width: size, height: size, borderRadius: opts.round ? '50%' : 6, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>{opts.placeholder || 'Photo'}</div>;
  };

  // --- RENDER INDIVIDUAL SECTIONS ---
  const renderSection = (id, options = {}) => {
    // 1. Visibility Check
    const config = sectionOrder.find(s => s.id === id);
    if (!config || !config.enabled) return null;

    // 2. Empty Data Check
    if (id === "experience" && formData.experience.length === 0) return null;
    if (id === "education" && formData.education.length === 0) return null;
    if (id === "certifications" && formData.certifications.length === 0) return null;
    if (id === "projects" && formData.projects.length === 0) return null;
    if (id === "summary" && !formData.summary) return null;
    if (id === "objective" && !formData.objective) return null;
    if (id === "skills" && !formData.skills) return null;
    if (id === "hobbies" && !formData.hobbies) return null;
    if (id === "languages" && !formData.languages) return null;
    if (id === "declaration" && !formData.declaration) return null;

    const st = inlineFrom(id);

    // --- SIDE HEADING STYLE ---
    // Added paddingBottom: 6px to prevent line overlapping text
    const titleStyle = options.titleStyle || {
      fontSize: Math.max(14, parseInt(st.fontSize) + 2),
      fontWeight: "bold",
      marginBottom: 10,
      paddingBottom: 6,
      textTransform: 'capitalize',
      color: options.color || 'inherit',
      borderBottom: options.border ? `1px solid ${options.color || '#ccc'}` : 'none'
    };

    switch (id) {
      case "objective":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Career Objective{options.useColon && ':'}</div>
            <div style={st}>{formData.objective}</div>
            {options.useDivider && <hr className="section-divider" />}
          </div>
        );
      case "summary":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Professional Summary{options.useColon && ':'}</div>
            <div style={st}>{formData.summary}</div>
          </div>
        );
      case "experience":
        return (
  <div key={id} className="resume-section">
    <div style={titleStyle}>Experience{options.useColon && ':'}</div>

    {formData.experience.map((ex, i) => (
      <div key={i} style={{ marginBottom: 12 }}>

        {/* Role + Date */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: st.fontSize, wordBreak: "break-word" }}>
            {ex.role}
          </div>

          <div
            style={{
              fontSize: '0.9em',
              fontWeight: 'bold',
              color: '#000',
              whiteSpace: 'nowrap'
            }}
          >
            {ex.start} {ex.start && ex.end && '-'} {ex.end}
          </div>
        </div>

        {/* Company + Location */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.95em',
            fontStyle: 'italic',
            color: '#444',
            marginBottom: 4,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }}
        >
          <span style={{ wordBreak: "break-word" }}>{ex.company}</span>
          <span style={{ wordBreak: "break-word" }}>{ex.location}</span>
        </div>

        {/* Description */}
        <div
          style={{
            ...st,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {ex.description}
        </div>

      </div>
    ))}
  </div>
);

      case "education":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Education{options.useColon && ':'}</div>
            {formData.education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                  <div style={{ fontSize: st.fontSize, fontWeight: 'bold' }}>{ed.degree}</div>
                  {/* Date forced black */}
                  <div style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#000' }}>{ed.year}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95em' }}>
                  <span style={{ fontStyle: 'italic' }}>{ed.school}</span>
                  <span>{ed.grade}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Projects{options.useColon && ':'}</div>
            {formData.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 6, ...st }}>
                <strong>{p.name}</strong>
                {p.description && <div>{p.description}</div>}
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Skills{options.useColon && ':'}</div>
            <div style={{ whiteSpace: 'pre-line', ...st }}>{formData.skills}</div>
          </div>
        );
      case "certifications":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Certifications{options.useColon && ':'}</div>
            {formData.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 4, fontWeight: 'bold', ...st }}>
                {c.name} {c.issuer && `- ${c.issuer}`}
                {c.year && <span style={{ float: 'right', fontSize: '0.9em' }}>{c.year}</span>}
              </div>
            ))}
          </div>
        );
      case "hobbies":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Hobbies{options.useColon && ':'}</div>
            <div style={st}>{formData.hobbies}</div>
          </div>
        );
      case "languages":
        return (
          <div key={id} className="resume-section">
            <div style={titleStyle}>Languages{options.useColon && ':'}</div>
            <div style={st}>{formData.languages}</div>
          </div>
        );
      case "declaration":
        return (
          <div key={id} className="resume-section" style={{ marginTop: 20 }}>
            <div style={titleStyle}>Declaration{options.useColon && ':'}</div>
            <div style={{ ...st, marginBottom: 40 }}>{formData.declaration}</div>
            {/* REMOVED: The div below was printing formData.name ("Jane Doe") at the bottom. 
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginRight: 20 }}>
              {formData.name}
            </div> 
            */}
          </div>
        );
      default: return null;
    }
  };

  // --- DOWNLOAD FUNCTION ---
  // const downloadPDF = async () => {
  //   if (!resumeRef.current) return;
  //   const el = resumeRef.current;
  //   const originalStyle = el.style.transform;
  //   el.style.transform = "none";

  //   try {
  //     const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("resume.pdf");
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     el.style.transform = originalStyle;
  //   }
  // };

  const downloadPDF = async () => {
  if (!resumeRef.current) return;

  const el = resumeRef.current;
  const originalStyle = el.style.transform;
  el.style.transform = "none";

  try {
    const canvas = await html2canvas(el, {
      scale: 3,              // high quality
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // FIT ENTIRE CANVAS INSIDE A4 WHILE MAINTAINING ASPECT RATIO
    const canvasAspect = canvas.width / canvas.height;
    const pageAspect = pdfWidth / pdfHeight;

    let renderWidth, renderHeight;

    if (canvasAspect > pageAspect) {
      // Wider than page → fit width
      renderWidth = pdfWidth;
      renderHeight = pdfWidth / canvasAspect;
    } else {
      // Taller than page → fit height
      renderHeight = pdfHeight;
      renderWidth = pdfHeight * canvasAspect;
    }

    // Center on page
    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
    pdf.save("resume.pdf");

  } catch (err) {
    console.error(err);
  } finally {
    el.style.transform = originalStyle;
  }
};


// --- TEMPLATE RENDERER (FIXED) ---
  const RenderTemplate = ({ id }) => {
    const [type, n] = id.split("-");
    const v = Number(n || 1);
    const globalStyle = inlineFrom("global");

    const renderBody = (opts = {}) => (
      <div className="resume-body-content">
        {sectionOrder.map(s => renderSection(s.id, opts))}
      </div>
    );

    // ===========================
    // CREATIVE TEMPLATES
    // ===========================
    
    // Creative 1: Sidebar Left (Blue)
    if (type === "creative" && v === 1) {
      return (
        <div className="sheet" style={{ display: "flex", ...globalStyle }}>
          <div style={{ width: "30%", background: "#0ea5e9", color: "white", padding: "30px", minHeight: "100%" }}>
            {formData.image && <div style={{ marginBottom: 15 }}>{renderImage({ size: 120, round: true })}</div>}
            
            <h1 style={{ fontSize: 30, lineHeight: 1.2, marginBottom: 5 }}>{formData.name}</h1>
            {/* ADDED TITLE HERE */}
            <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 20, fontWeight: "600" }}>{formData.title}</div>

            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <div>{formData.email}</div>
              <div>{formData.phone}</div>
              {/* ADDED DOB HERE */}
              {formData.dob && <div>DOB: {formData.dob}</div>}
              <div style={{ marginTop: 5 }}>{formData.address}</div>
            </div>
          </div>

          <div style={{ padding: "40px", width: "70%" }}>
            {renderBody({
              border: true,
              titleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                textTransform: "uppercase",
                borderLeft: "4px solid #0ea5e9",
                paddingLeft: 10,
                marginBottom: 12
              }
            })}
          </div>
        </div>
      );
    }

    // Creative 2: Dark Header with Circle Image
    if (type === "creative" && v === 2) {
      return (
        <div className="sheet" style={{ padding: 0, ...globalStyle }}>
          <div style={{ display: "flex", background: "#466dc0ff", color: "white", padding: "35px 45px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 45, margin: 0, fontWeight: "800", color:"black" }}>{formData.name}</h1>
              {/* TITLE IS HERE */}
              <p style={{ opacity: 0.85, marginTop: 5, fontSize: 25, color: "black" }}>{formData.title}</p>
              
              {/* ADDED CONTACT INFO & DOB HERE TO HEADER */}
              <div style={{ marginTop: 15, fontSize: 24, color: "#d1d5db", display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                 <span>{formData.email}</span>
                 <span>{formData.phone}</span>
                 {formData.dob && <span>{formData.dob}</span>}
                 <span>{formData.address}</span>
              </div>
            </div>
            <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#374151", overflow: "hidden", border: "4px solid #1f2937", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
              {formData.image ? renderImage({ size: 130, round: true }) : null}
            </div>
          </div>
          <div style={{ padding: "40px" }}>
            {renderBody({
              titleStyle: {
                fontSize: 20,
                borderBottom: "2px solid #111827",
                marginBottom: 12,
                paddingBottom: 4,
                textTransform: "uppercase",
                fontWeight: "700",
                letterSpacing: "1px",
                color: "#111827",
              },
            })}
          </div>
        </div>
      );
    }

    // Creative 3: Pink/Red Theme
    if (type === "creative" && v === 3) {
      return (
        <div className="sheet" style={{ padding: 40, background: "#fff1f2", ...globalStyle }}>
          <h1 style={{ fontSize: 40, color: "#be185d", marginBottom: 0 }}>{formData.name}</h1>
          {/* ADDED TITLE */}
          <div style={{ fontSize: 24, color: "#9d174d", marginBottom: 15, fontWeight: "bold" }}>{formData.title}</div>
          
          {/* ADDED CONTACT & DOB */}
          <div style={{ marginBottom: 30, fontSize: 25, color: "#831843" }}>
            {formData.email} • {formData.phone} {formData.dob && `• ${formData.dob}`} • {formData.address}
          </div>

          {renderBody({
            titleStyle: {
              background: "#fce7f3",
              padding: "6px 10px",
              borderRadius: 6,
              fontWeight: "bold",
              color: "#9d174d",
              marginBottom: 8
            }
          })}
        </div>
      );
    }

    // Creative 4: Modern Clean Split
    if (type === "creative" && v === 4) {
  return (
    <div className="sheet creative-4" style={{ ...globalStyle, padding: 40, background: "#f8fafc" }}>
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 20,
          marginBottom: 30,
          borderBottom: "3px solid #e2e8f0",
          background: "linear-gradient(to right, #69c4ddff, #40b3b1ff)",
          borderRadius: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", margin: 0 }}>
            {formData.name}
          </h1>

          <div style={{ fontSize: 17, color: "#475569", fontWeight: 600, marginTop: 6 }}>
            {formData.title}
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: 14, lineHeight: 1.8, color: "#334155" }}>
          <div>{formData.email}</div>
          <div>{formData.phone}</div>
          <div>{formData.address}</div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", gap: 30 }}>  

        {/* RIGHT CONTENT */}
        <div style={{ flex: 1 }}>
          {renderBody({
            titleStyle: {
              fontSize: 19,
              fontWeight: 800,
              color: "#0f172a",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: 6,
              marginBottom: 14,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            },
            textStyle: {
              fontSize: 14.5,
              color: "#334155",
              lineHeight: 1.7,
            },
          })}
        </div>
      </div>
    </div>
  );
}

// if (type === "creative" && v === 4) {
//   return (
//     <div className="sheet creative-4" style={globalStyle}>
      
//       {/* HEADER */}
//       <div className="creative4-header">
//         <div>
//           <h1 className="creative4-name">{formData.name}</h1>
//           <div className="creative4-title">{formData.title}</div>
//         </div>

//         <div className="creative4-contact">
//           <div>{formData.email}</div>
//           <div>{formData.phone}</div>
//           <div>{formData.address}</div>
//         </div>
//       </div>

//       {/* BODY */}
//       <div className="creative4-body">

//         {/* RIGHT CONTENT */}
//         <div className="creative4-content">
//           {renderBody({
//             titleStyle: {
//               fontSize: 20,
//               fontWeight: 900,
//               color: "#172554",
//               borderBottom: "2px solid #bfdbfe",
//               paddingBottom: 6,
//               marginBottom: 14,
//               textTransform: "uppercase",
//               letterSpacing: "1.5px",
//             },
//             textStyle: {
//               fontSize: 15,
//               color: "#1e293b",
//               lineHeight: 1.7,
//             },
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


    // ===========================
    // EXECUTIVE TEMPLATES
    // ===========================

    // Executive 1: Simple Top Header
    if (type === "executive" && v === 1) {
      return (
        <div className="sheet" style={{ padding: 40, ...globalStyle }}>
          <h1 style={{ fontSize: 38, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{formData.name}</h1>
          {/* ADDED TITLE */}
          <div style={{ fontSize: 23, color: "#1e3a8a", fontWeight: "bold", marginBottom: 10, textTransform: "uppercase" }}>{formData.title}</div>

          {/* ADDED DOB TO CONTACT */}
          <p style={{ color: "#4b5563", marginBottom: 30, fontSize: 23 }}>
            {formData.email} | {formData.phone} | {formData.address}
          </p>

          {renderBody({
            border: true,
            titleStyle: {
              fontSize: 18,
              fontWeight: "bold",
              borderBottom: "2px solid #1e3a8a",
              paddingBottom: 5,
              marginBottom: 12,
              color: "#1e3a8a"
            },
            textStyle: {
              fontSize: 25,
              color: "#1e293b",
              lineHeight: 1.7,
            },
          })}
        </div>
      );
    }

    // Executive 2: Sidebar Left (Grey)
    if (type === "executive" && v === 2) {
      return (
        <div className="sheet" style={{ display: "flex", ...globalStyle }}>
          <div style={{ width: "26%", background: "#f3f4f6", padding: "30px 20px", borderRight: "2px solid #e5e7eb", minHeight: '100%' }}>
            {formData.image && <div style={{ marginBottom: 20 }}>{renderImage({ size: 100, round: true })}</div>}
            
            <h2 style={{ fontSize: 24, fontWeight: 'bold', lineHeight: 1.2 }}>{formData.name}</h2>
            {/* ADDED TITLE */}
            <div style={{ fontSize: 14, color: "#4b5563", marginBottom: 20, fontWeight: "600" }}>{formData.title}</div>

            <div style={{ fontSize: 12, lineHeight: 1.6 }}>
               <p style={{marginBottom: 4}}>{formData.email}</p>
               <p style={{marginBottom: 4}}>{formData.phone}</p>
               
               <p>{formData.address}</p>
            </div>
          </div>

          <div style={{ padding: "40px", width: "74%" }}>
            {renderBody({
              titleStyle: {
                fontWeight: "bold",
                fontSize: 18,
                color: "#111827",
                textTransform: "uppercase",
                marginBottom: 10,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: 5
              }
            })}
          </div>
        </div>
      );
    }

    // Executive 3: Centered Header
    if (type === "executive" && v === 3) {
      return (
        <div className="sheet" style={{ padding: 40, ...globalStyle }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30, borderBottom: "4px solid #e0e7ff", paddingBottom: 20 }}>
             <div>
                <h1 style={{ fontSize: 36, lineHeight: 1 }}>{formData.name}</h1>
                {/* ADDED TITLE */}
                <div style={{ fontSize: 18, color: "#4338ca", marginTop: 5 }}>{formData.title}</div>
             </div>
             <div style={{ textAlign: "right", fontSize: 13, color: "#374151" }}>
                <div>{formData.email}</div>
                <div>{formData.phone}</div>
               
                <div>{formData.address}</div>
             </div>
          </div>

          {renderBody({
            titleStyle: {
              background: "#e0e7ff",
              padding: "6px 10px",
              borderRadius: 4,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#3730a3"
            }
          })}
        </div>
      );
    }

    // Executive 4: Serif / Traditional
    if (type === "executive" && v === 4) {
      return (
        <div className="sheet" style={{ padding: 50, fontFamily: "Georgia, serif", ...globalStyle }}>
          <div style={{ textAlign: 'center', borderBottom: "3px solid #000", paddingBottom: 20, marginBottom: 25 }}>
            <h1 style={{ fontSize: 40, marginBottom: 5 }}>{formData.name}</h1>
            {/* ADDED TITLE */}
            <div style={{ fontSize: 18, fontStyle: "italic", marginBottom: 10 }}>{formData.title}</div>
            
            {/* ADDED DOB */}
            <p style={{ fontSize: 14 }}>
              {formData.email} • {formData.phone} • {formData.address}
            </p>
          </div>

          {renderBody({
            titleStyle: {
              fontFamily: "Georgia, serif",
              fontSize: 20,
              borderBottom: "1px solid #000",
              marginBottom: 12,
              fontWeight: "bold",
              textTransform: "uppercase"
            }
          })}
        </div>
      );
    }

    // ===========================
    // MINIMALIST TEMPLATES
    // ===========================

    // Minimalist 1: Large Name
    if (type === "minimalist" && v === 1) {
      return (
        <div className="sheet" style={{ padding: 50, ...globalStyle }}>
          <h1 style={{ fontSize: 42, marginBottom: 0, lineHeight: 1 }}>{formData.name}</h1>
          {/* ADDED TITLE */}
          <div style={{ fontSize: 20, color: "#6b7280", marginBottom: 15 }}>{formData.title}</div>
          
          {/* ADDED DOB */}
          <p style={{ opacity: 0.7, marginBottom: 40, fontSize: 13, borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
            {formData.email} · {formData.phone} {formData.dob && `· ${formData.dob}`} · {formData.address}
          </p>

          {renderBody({
            titleStyle: {
              fontSize: 16,
              fontWeight: "700",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 10,
              color: "#111827"
            }
          })}
        </div>
      );
    }

    // Minimalist 2: Thin Divider
    if (type === "minimalist" && v === 2) {
      return (
        <div className="sheet" style={{ padding: 40, ...globalStyle }}>
          <h1 style={{ fontSize: 35, marginBottom: 5 }}>{formData.name}</h1>
          {/* ADDED TITLE */}
          <div style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: 2, marginBottom: 15, color: "#374151" }}>{formData.title}</div>

          {/* ADDED DOB */}
          <div style={{ marginBottom: 25, fontSize: 13, color: "#6b7280", borderBottom: "1px solid #d1d5db", paddingBottom: 15 }}>
            {formData.email} | {formData.phone} {formData.dob && `| ${formData.dob}`} | {formData.address}
          </div>

          {renderBody({
            titleStyle: {
              fontSize: 17,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#000"
            }
          })}
        </div>
      );
    }

    // Minimalist 3: Grey Box Headers
    if (type === "minimalist" && v === 3) {
      return (
        <div className="sheet" style={{ padding: 45, ...globalStyle }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
             <div>
                <h1 style={{ fontSize: 38, marginBottom: 5 }}>{formData.name}</h1>
                {/* ADDED TITLE */}
                <div style={{ fontSize: 18, color: "#4b5563" }}>{formData.title}</div>
             </div>
             <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
                <div>{formData.email}</div>
                <div>{formData.phone}</div>
                {/* ADDED DOB */}
                {formData.dob && <div>{formData.dob}</div>}
                <div>{formData.address}</div>
             </div>
          </div>
          <hr style={{ borderColor: "#e5e7eb", marginBottom: 30 }} />

          {renderBody({
            titleStyle: {
              background: "#f3f4f6",
              padding: "8px 10px",
              borderRadius: 6,
              fontWeight: "bold",
              marginBottom: 12,
              fontSize: 14,
              textTransform: "uppercase"
            }
          })}
        </div>
      );
    }

    // Minimalist 4: Right Aligned Header
    if (type === "minimalist" && v === 4) {
      return (
        <div className="sheet" style={{ padding: 50, ...globalStyle }}>
          <div style={{ textAlign: "right", marginBottom: 40, borderBottom: "4px solid #000", paddingBottom: 20 }}>
            <h1 style={{ fontSize: 40, marginBottom: 4 }}>{formData.name}</h1>
            {/* ADDED TITLE */}
            <div style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}>{formData.title}</div>
            {/* ADDED DOB */}
            <p style={{ fontSize: 13 }}>{formData.email} • {formData.phone} {formData.dob && `• ${formData.dob}`} • {formData.address}</p>
          </div>

          {renderBody({
            titleStyle: {
              fontSize: 18,
              borderLeft: "3px solid #000",
              paddingLeft: 10,
              marginBottom: 12,
              fontWeight: "bold",
              textTransform: "uppercase"
            }
          })}
        </div>
      );
    }

    return null;
  };

  // --- MAIN LAYOUT ---
  return (
    <div className="rb-layout">
      {/* SIDEBAR */}
      <div className="rb-sidebar">

        {/* TABS */}
        <div className="rb-tabs">
          <button className={activeTab === 'data' ? 'active' : ''} onClick={() => setActiveTab('data')}>Data</button>
          <button className={activeTab === 'layout' ? 'active' : ''} onClick={() => setActiveTab('layout')}>Layout</button>
          <button className={activeTab === 'style' ? 'active' : ''} onClick={() => setActiveTab('style')}>Style</button>
        </div>

        {/* TOP DOWNLOAD BUTTON (For extra visibility) */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #eee', background: '#fff' }}>
          <button className="btn-export" style={{ padding: '10px', fontSize: '14px' }} onClick={downloadPDF}>
            ↓ Download PDF
          </button>
        </div>

        <div className="rb-sidebar-content">
          {/* DATA TAB */}
          {activeTab === 'data' && (
            <>
              <div className="control-group">
                <h3>Personal Info</h3>
                <input className="input" placeholder="Full Name" value={formData.name} onChange={e => setField('name', e.target.value)} />
                <input className="input" placeholder="Job Title" value={formData.title} onChange={e => setField('title', e.target.value)} />
                <div className="row">
                  <input className="input" placeholder="Email" value={formData.email} onChange={e => setField('email', e.target.value)} />
                  <input className="input" placeholder="Phone" value={formData.phone} onChange={e => setField('phone', e.target.value)} />
                </div>
                <textarea className="textarea" placeholder="Address" value={formData.address} onChange={e => setField('address', e.target.value)} />
                <input className="input" placeholder="Career Objective" value={formData.objective} onChange={e => setField('objective', e.target.value)} />
                <textarea className="textarea" placeholder="Professional Summary" value={formData.summary} onChange={e => setField('summary', e.target.value)} />
              </div>

              <div className="control-group">
  <h3>Profile Photo</h3>
  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} />

  {formData.image && (
    <div style={{ marginTop: 8 }}>
      
      {/* NEW Circular zoom preview */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
          }}
          className="photo-circle"
        >
          <img
            src={formData.image}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            className="photo-img"
          />
        </div>
      </div>

      <button className="btn-del" onClick={removeImage}>Remove Photo</button>
    </div>
  )}
</div>

              <div className="control-group">
                <h3>Experience</h3>
                {formData.experience.map((ex, i) => (
                  <div key={i} className="array-item">
                    <input className="input" placeholder="Role" value={ex.role} onChange={e => setArrayField('experience', i, 'role', e.target.value)} />
                    <input className="input" placeholder="Company" value={ex.company} onChange={e => setArrayField('experience', i, 'company', e.target.value)} />
                    <input className="input" placeholder="Location" value={ex.location} onChange={e => setArrayField('experience', i, 'location', e.target.value)} />
                    <div className="row">
                      <input className="input" placeholder="Start" value={ex.start} onChange={e => setArrayField('experience', i, 'start', e.target.value)} />
                      <input className="input" placeholder="End" value={ex.end} onChange={e => setArrayField('experience', i, 'end', e.target.value)} />
                    </div>
                    <textarea className="textarea" placeholder="Description" value={ex.description} onChange={e => setArrayField('experience', i, 'description', e.target.value)} />
                    <button className="btn-del" onClick={() => removeArrayItem('experience', i)}>Remove</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => addArrayItem('experience')}>+ Add Experience</button>
              </div>

              <div className="control-group">
                <h3>Projects</h3>
                {formData.projects.map((p, i) => (
                  <div key={i} className="array-item">
                    <input className="input" placeholder="Project Name" value={p.name} onChange={e => setArrayField('projects', i, 'name', e.target.value)} />
                    <textarea className="textarea" placeholder="Description" value={p.description} onChange={e => setArrayField('projects', i, 'description', e.target.value)} />
                    <button className="btn-del" onClick={() => removeArrayItem('projects', i)}>Remove</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => addArrayItem('projects')}>+ Add Project</button>
              </div>

              <div className="control-group">
                <h3>Education</h3>
                {formData.education.map((ed, i) => (
                  <div key={i} className="array-item">
                    <input className="input" placeholder="Degree" value={ed.degree} onChange={e => setArrayField('education', i, 'degree', e.target.value)} />
                    <input className="input" placeholder="School" value={ed.school} onChange={e => setArrayField('education', i, 'school', e.target.value)} />
                    <input className="input" placeholder="Year" value={ed.year} onChange={e => setArrayField('education', i, 'year', e.target.value)} />
                    <input className="input" placeholder="Grade/CGPA" value={ed.grade} onChange={e => setArrayField('education', i, 'grade', e.target.value)} />
                    <button className="btn-del" onClick={() => removeArrayItem('education', i)}>Remove</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => addArrayItem('education')}>+ Add Education</button>
              </div>

              <div className="control-group">
                <h3>Certifications</h3>
                {formData.certifications.map((c, i) => (
                  <div key={i} className="array-item">
                    <input className="input" placeholder="Name" value={c.name} onChange={e => setArrayField('certifications', i, 'name', e.target.value)} />
                    <input className="input" placeholder="Issuer" value={c.issuer} onChange={e => setArrayField('certifications', i, 'issuer', e.target.value)} />
                    <button className="btn-del" onClick={() => removeArrayItem('certifications', i)}>Remove</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => addArrayItem('certifications')}>+ Add Certification</button>
              </div>

              <div className="control-group">
                <h3>Other Details</h3>
                <textarea className="textarea" placeholder="Skills (comma separated)" value={formData.skills} onChange={e => setField('skills', e.target.value)} />
                <textarea className="textarea" placeholder="Hobbies" value={formData.hobbies} onChange={e => setField('hobbies', e.target.value)} />
                <textarea className="textarea" placeholder="Languages" value={formData.languages} onChange={e => setField('languages', e.target.value)} />
                <textarea className="textarea" placeholder="Declaration" value={formData.declaration} onChange={e => setField('declaration', e.target.value)} />
              </div>
            </>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="control-group">
              <h3>Manage Layout</h3>
              <p className="muted">Click Eye (👁️) to Hide/Show. Use Arrows to Reorder.</p>
              <div className="drag-list">
                {sectionOrder.map((s, idx) => (
                  <div key={s.id} className="drag-item" style={{ opacity: s.enabled ? 1 : 0.6 }}>
                    <span style={{ fontWeight: s.enabled ? 'bold' : 'normal' }}>{s.label}</span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => toggleSection(s.id)}
                        className={s.enabled ? "btn-vis on" : "btn-vis off"}
                        title={s.enabled ? "Hide Section" : "Show Section"}
                      >
                        {s.enabled ? "👁️" : "🚫"}
                      </button>

                      <button onClick={() => moveSection(idx, -1)} disabled={idx === 0}>↑</button>
                      <button onClick={() => moveSection(idx, 1)} disabled={idx === sectionOrder.length - 1}>↓</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === 'style' && (
            <div className="control-group">
              <h3>Templates</h3>
              <div className="thumb-grid">
                {TEMPLATE_LIST.map(t => (
                  <div key={t.id} className={`thumb ${selectedTemplate === t.id ? 'active' : ''}`} onClick={() => setSelectedTemplate(t.id)}>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM DOWNLOAD BUTTON */}
        <div className="sidebar-footer">
          <button className="btn-export" onClick={downloadPDF}>Download PDF (A4)</button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="rb-main">
        <div className="preview-container">
          <div className="page-scale" ref={resumeRef}>
            <RenderTemplate id={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
