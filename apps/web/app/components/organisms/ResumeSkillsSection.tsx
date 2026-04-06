"use client";

import { useState } from "react";
import { sectionStyle, sectionTitle } from "../../lib/constants/resume-styles";

export function ResumeSkillsSection({
    skills,
    isEditing = true,
    onAdd,
    onRemove,
}: {
    skills: string[];
    isEditing?: boolean;
    onAdd: (skill: string) => void;
    onRemove: (skill: string) => void;
}) {
    const [skillInput, setSkillInput] = useState("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            onAdd(skillInput.trim());
            setSkillInput("");
        }
    }

    return (
        <section style={sectionStyle}>
            <h2 style={sectionTitle}>Skills</h2>

            {isEditing && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C2333", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                    <span style={{ color: "#555" }}>🔍</span>
                    <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a skill and press Enter (e.g. JavaScript)"
                        style={{ background: "transparent", border: "none", outline: "none", color: "#fff", flex: 1, fontSize: 14 }}
                    />
                </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map((skill) => (
                    <span key={skill} style={{ background: "#1C2B46", color: "#3B82F6", borderRadius: 99, padding: "4px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        {skill}
                        {isEditing && (
                            <button
                                onClick={() => onRemove(skill)}
                                style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}
                            >
                                ×
                            </button>
                        )}
                    </span>
                ))}
                {skills.length === 0 && (
                    <p style={{ color: "#555", fontSize: 14 }}>Nenhuma skill adicionada.</p>
                )}
            </div>
        </section>
    );
}
