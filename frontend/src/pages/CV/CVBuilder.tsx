import { useEffect, useState } from "react";
import styles from "./CVBuilder.module.css";
import { getCV, saveCV as persistCV } from "../../services/service";
import type { CVData, EducationItem, ExperienceItem } from "../../types/cv";
import { initialCV } from "../../types/cv.initial";

export default function CVBuilder() {
  const [cv, setCV] = useState<CVData>(initialCV);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCV = async () => {
      try {
        const savedCV = await getCV();
        if (savedCV) setCV({ ...initialCV, ...savedCV });
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "No se pudo cargar el CV",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCV();
  }, []);

  const updateField = (
    field: keyof Omit<
      CVData,
      "experience" | "education" | "hardSkills" | "softSkills"
    >,
    value: string,
  ) => {
    setCV((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string,
  ) => {
    setCV((prev) => ({
      ...prev,
      experience: prev.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string,
  ) => {
    setCV((prev) => ({
      ...prev,
      education: prev.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addEducation = () => {
    setCV((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          school: "",
          comments: "",
          period: "",
        },
      ],
    }));
  };

  const addExperience = () => {
    setCV((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", period: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setCV((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeEducation = (index: number) => {
    setCV((prev) => ({
      ...prev,
      education: prev.education.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateSkills = (type: "hardSkills" | "softSkills", value: string) => {
    setCV((prev) => ({
      ...prev,
      [type]: value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const saveCV = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const result = await persistCV(cv);
      setMessage(result.message || "CV guardado correctamente");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo guardar el CV",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Cargando tu CV...</p>;

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Módulo visual</p>
          <h1 className={styles.pageTitle}>Hoja de vida</h1>
        </div>

        <div className={styles.options}>
          <button
            type="button"
            className={styles.printButton}
            onClick={handlePrint}
          >
            Imprimir en PDF
          </button>

          <button
            type="button"
            className={styles.printButton}
            onClick={() => void saveCV()}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar CV"}
          </button>
        </div>
      </div>

      {message && <p role="status">{message}</p>}

      <div className={styles.layout}>
        <section className={styles.editorPanel}>
          <div className={styles.sectionHeader}>Datos personales</div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Nombre completo</span>
              <input
                value={cv.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Profesión / título</span>
              <input
                value={cv.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input
                value={cv.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Teléfono</span>
              <input
                value={cv.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </label>

            <label className={styles.fieldFull}>
              <span>Ubicación</span>
              <input
                value={cv.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Github</span>
              <input
                value={cv.github}
                onChange={(e) => updateField("github", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Certificados</span>
              <input
                value={cv.certificados}
                onChange={(e) => updateField("certificados", e.target.value)}
              />
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
                  onChange={(e) =>
                    updateExperience(index, "role", e.target.value)
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Empresa</span>
                <input
                  value={item.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Periodo</span>
                <input
                  value={item.period}
                  onChange={(e) =>
                    updateExperience(index, "period", e.target.value)
                  }
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Logros / responsabilidades</span>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                />
              </label>

              <button type="button" onClick={() => removeExperience(index)}>
                Eliminar experiencia
              </button>
            </div>
          ))}

          <button type="button" onClick={addExperience}>
            + Agregar experiencia
          </button>

          <div className={styles.sectionHeader}>Educación</div>

          {cv.education.map((item, index) => (
            <div key={`education-${index}`} className={styles.cardList}>
              <label className={styles.field}>
                <span>Título</span>
                <input
                  value={item.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Institución</span>
                <input
                  value={item.school}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Comentarios</span>
                <input
                  value={item.comments || ""}
                  onChange={(e) =>
                    updateEducation(index, "comments", e.target.value)
                  }
                />
              </label>

              <label className={styles.fieldFull}>
                <span>Periodo</span>
                <input
                  value={item.period}
                  onChange={(e) =>
                    updateEducation(index, "period", e.target.value)
                  }
                />
              </label>

              <button type="button" onClick={() => removeEducation(index)}>
                Eliminar educación
              </button>
            </div>
          ))}

          <div>
            <button type="button" onClick={addEducation}>
              + Agregar educación
            </button>
          </div>

          <div className={styles.sectionHeader}>Habilidades</div>

          <label className={styles.fieldFull}>
            <span>Habilidades duras</span>
            <textarea
              rows={3}
              value={cv.hardSkills.join(", ")}
              onChange={(e) => updateSkills("hardSkills", e.target.value)}
              placeholder="Java, Python, JavaScript, React, SQL..."
            />
          </label>

          <label className={styles.fieldFull}>
            <span>Habilidades blandas</span>
            <textarea
              rows={3}
              value={cv.softSkills.join(", ")}
              onChange={(e) => updateSkills("softSkills", e.target.value)}
              placeholder="Trabajo en equipo, comunicación, liderazgo..."
            />
          </label>
        </section>

        <section className={styles.previewPanel}>
          <article
            className={styles.cvPage}
            aria-label="Vista previa de hoja de vida"
          >
            <header className={styles.header}>
              <div>
                <h2>{cv.name || "Nombre completo"}</h2>
                <p>{cv.title || "Título profesional"}</p>
              </div>
            </header>

            <div className={styles.contactRow}>
              <span>
                <a href={`mailto:${cv.email}`}>{cv.email}</a>
              </span>
              <span>
                <a href={`tel:${cv.phone}`}>{cv.phone}</a>
              </span>
              <span>{cv.location || "Ciudad, País"}</span>
              <span>
                <a href={cv.github} target="_blank" rel="noopener noreferrer">
                  Github
                </a>
              </span>
              <span>
                <a
                  href={cv.certificados}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Certificados
                </a>
              </span>
            </div>

            <section className={styles.sectionBlock}>
              <h3>Perfil profesional</h3>
              <p>
                {cv.summary ||
                  "Escribe un resumen profesional para destacar tus fortalezas y experiencia."}
              </p>
            </section>

            <section className={styles.sectionBlock}>
              {cv.experience.map((item, index) => (
                <div
                  key={`preview-experience-${index}`}
                  className={styles.itemBlock}
                >
                  <h3>Experiencia</h3>
                  <div className={styles.itemHeader}>
                    <strong>{item.role || "Cargo"}</strong>
                    <span>{item.period || "Periodo"}</span>
                  </div>
                  <p className={styles.company}>{item.company || "Empresa"}</p>
                  <p>
                    {item.description ||
                      "Describe tus responsabilidades o logros relevantes."}
                  </p>
                </div>
              ))}
            </section>

            <section className={styles.sectionBlock}>
              <h3>Educación</h3>
              {cv.education.map((item, index) => (
                <div
                  key={`preview-education-${index}`}
                  className={styles.itemBlock}
                >
                  <div className={styles.itemHeader}>
                    <strong>{item.degree || "Título"}</strong>
                    <span>{item.period || "Periodo"}</span>
                  </div>
                  <p>{item.school || "Institución"}</p>

                  {item.comments && (
                    <p className={styles.educationComment}>{item.comments}</p>
                  )}
                </div>
              ))}
            </section>

            <section className={styles.sectionBlock}>
              <h3 className={styles.skillsTitle}>Habilidades</h3>

              <div className={styles.skillsContainer}>
                <div className={styles.skillsColumn}>
                  <h4>Habilidades duras</h4>

                  <ul>
                    {cv.hardSkills.map(
                      (skill, index) =>
                        skill.trim() && <li key={`hard-${index}`}>{skill}</li>,
                    )}
                  </ul>
                </div>

                <div className={styles.skillsDivider}></div>

                <div className={styles.skillsColumn}>
                  <h4>Habilidades blandas</h4>

                  <ul>
                    {cv.softSkills.map(
                      (skill, index) =>
                        skill.trim() && <li key={`soft-${index}`}>{skill}</li>,
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </article>
        </section>
      </div>
    </div>
  );
}
