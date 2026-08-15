import { useState } from "react";
import styles from "./CVBuilder.module.css";

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

type EducationItem = {
  degree: string;
  school: string;
  period: string;
};

type CVData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
};

const initialCV: CVData = {
  name: "Ana María López",
  title: "Especialista en Marketing Digital",
  email: "ana.lopez@email.com",
  phone: "+57 300 123 4567",
  location: "Bogotá, Colombia",
  summary:
    "Profesional en marketing digital con 6 años de experiencia en estrategia de contenido, campañas de adquisición y análisis de métricas. Me enfoco en la optimización de funnels, retención y crecimiento de marcas con enfoque comercial y medible.",
  experience: [
    {
      role: "Coordinadora de Marketing Digital",
      company: "Nexa Studio",
      period: "2022 - Presente",
      description:
        "Lideré campañas multicanal, optimicé presupuestos de ads y mejoré la tasa de conversión en un 38% mediante estrategias de remarketing y segmentación avanzada.",
    },
    {
      role: "Analista de Marketing",
      company: "BrightWorks",
      period: "2019 - 2022",
      description:
        "Desarrollé campañas en Google Ads, Meta y email marketing, además de reportes mensuales de rendimiento para la dirección comercial.",
    },
  ],
  education: [
    {
      degree: "Ingeniera Comercial",
      school: "Universidad del Bosque",
      period: "2012 - 2018",
    },
    {
      degree: "Especialización en Digital Marketing",
      school: "Pontificia Universidad Javeriana",
      period: "2019 - 2020",
    },
  ],
  skills: [
    "Google Ads",
    "SEO",
    "Analítica web",
    "Branding",
    "E-commerce",
    "Content Strategy",
  ],
};

export default function CVBuilder() {
  const [cv, setCV] = useState<CVData>(initialCV);

  const updateField = (field: keyof Omit<CVData, "experience" | "education" | "skills">, value: string) => {
    setCV((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    setCV((prev) => ({
      ...prev,
      experience: prev.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setCV((prev) => ({
      ...prev,
      education: prev.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateSkills = (value: string) => {
    setCV((prev) => ({
      ...prev,
      skills: value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Módulo visual</p>
          <h1 className={styles.pageTitle}>Hoja de vida</h1>
        </div>

        <button type="button" className={styles.printButton} onClick={handlePrint}>
          Imprimir en PDF
        </button>
      </div>

      <div className={styles.layout}>
        <section className={styles.editorPanel}>
          <div className={styles.sectionHeader}>Datos personales</div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Nombre completo</span>
              <input value={cv.name} onChange={(e) => updateField("name", e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Profesión / título</span>
              <input value={cv.title} onChange={(e) => updateField("title", e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input value={cv.email} onChange={(e) => updateField("email", e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Teléfono</span>
              <input value={cv.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </label>

            <label className={styles.fieldFull}>
              <span>Ubicación</span>
              <input value={cv.location} onChange={(e) => updateField("location", e.target.value)} />
            </label>

            <label className={styles.fieldFull}>
              <span>Perfil profesional</span>
              <textarea
                rows={4}
                value={cv.summary}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </label>
          </div>

          <div className={styles.sectionHeader}>Experiencia laboral</div>

          {cv.experience.map((item, index) => (
            <div key={`experience-${index}`} className={styles.cardList}>
              <label className={styles.field}>
                <span>Cargo</span>
                <input
                  value={item.role}
                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Empresa</span>
                <input
                  value={item.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Periodo</span>
                <input
                  value={item.period}
                  onChange={(e) => updateExperience(index, "period", e.target.value)}
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Logros / responsabilidades</span>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                />
              </label>
            </div>
          ))}

          <div className={styles.sectionHeader}>Educación</div>

          {cv.education.map((item, index) => (
            <div key={`education-${index}`} className={styles.cardList}>
              <label className={styles.field}>
                <span>Título</span>
                <input
                  value={item.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Institución</span>
                <input
                  value={item.school}
                  onChange={(e) => updateEducation(index, "school", e.target.value)}
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Periodo</span>
                <input
                  value={item.period}
                  onChange={(e) => updateEducation(index, "period", e.target.value)}
                />
              </label>
            </div>
          ))}

          <div className={styles.sectionHeader}>Habilidades</div>

          <label className={styles.fieldFull}>
            <span>Habilidades principales</span>
            <textarea
              rows={3}
              value={cv.skills.join(", ")}
              onChange={(e) => updateSkills(e.target.value)}
            />
          </label>
        </section>

        <section className={styles.previewPanel}>
          <article className={styles.cvPage} aria-label="Vista previa de hoja de vida">
            <header className={styles.header}>
              <div>
                <h2>{cv.name || "Nombre completo"}</h2>
                <p>{cv.title || "Título profesional"}</p>
              </div>
            </header>

            <div className={styles.contactRow}>
              <span>{cv.email || "correo@ejemplo.com"}</span>
              <span>{cv.phone || "+00 000 000 0000"}</span>
              <span>{cv.location || "Ciudad, País"}</span>
            </div>

            <section className={styles.sectionBlock}>
              <h3>Perfil profesional</h3>
              <p>{cv.summary || "Escribe un resumen profesional para destacar tus fortalezas y experiencia."}</p>
            </section>

            <section className={styles.sectionBlock}>
              <h3>Experiencia</h3>
              {cv.experience.map((item, index) => (
                <div key={`preview-experience-${index}`} className={styles.itemBlock}>
                  <div className={styles.itemHeader}>
                    <strong>{item.role || "Cargo"}</strong>
                    <span>{item.period || "Periodo"}</span>
                  </div>
                  <p className={styles.company}>{item.company || "Empresa"}</p>
                  <p>{item.description || "Describe tus responsabilidades o logros relevantes."}</p>
                </div>
              ))}
            </section>

            <section className={styles.sectionBlock}>
              <h3>Educación</h3>
              {cv.education.map((item, index) => (
                <div key={`preview-education-${index}`} className={styles.itemBlock}>
                  <div className={styles.itemHeader}>
                    <strong>{item.degree || "Título"}</strong>
                    <span>{item.period || "Periodo"}</span>
                  </div>
                  <p>{item.school || "Institución"}</p>
                </div>
              ))}
            </section>

            <section className={styles.sectionBlock}>
              <h3>Habilidades</h3>
              <div className={styles.skillList}>
                {cv.skills.length > 0 ? (
                  cv.skills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className={styles.skillPill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className={styles.emptyText}>Añade tus principales habilidades.</span>
                )}
              </div>
            </section>
          </article>
        </section>
      </div>
    </div>
  );
}
