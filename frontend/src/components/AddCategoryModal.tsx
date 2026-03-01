import React, { useState } from "react";
import { Modal, Button } from "../vibes";
import { TextField } from "../vibes";
import { createCategory } from "../services/api";
import { registerCategoryEmoji } from "../constants/categoryEmojis";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (name: string) => void;
}

const EMOJI_OPTIONS = [
  "🍔",
  "🚗",
  "🏠",
  "💊",
  "🎮",
  "✈️",
  "👗",
  "💡",
  "📚",
  "🎬",
  "🏋️",
  "🐶",
  "🎁",
  "💼",
  "🌿",
  "🔧",
  "💅",
  "🍷",
  "☕",
  "🛒",
  "💰",
  "📱",
  "🎵",
  "🏥",
];

export const AddCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [nameError, setNameError] = useState("");
  const [emojiError, setEmojiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError("Category name is required");
      valid = false;
    }
    if (!emoji) {
      setEmojiError("Please select an emoji");
      valid = false;
    }
    if (!valid) return;

    try {
      setIsSubmitting(true);
      const cat = await createCategory({ name: name.trim() });
      registerCategoryEmoji(name.trim(), emoji);
      onCreated(cat.name);
      setName("");
      setEmoji("");
      setNameError("");
      setEmojiError("");
      onClose();
    } catch (err: any) {
      if (
        err.message?.toLowerCase().includes("duplicate") ||
        err.message?.toLowerCase().includes("taken")
      ) {
        setNameError("This category already exists");
      } else {
        setNameError("Could not create category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const emojiGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "8px",
    marginTop: "4px",
  };

  const emojiBtnStyle = (selected: boolean): React.CSSProperties => ({
    fontSize: "20px",
    padding: "6px",
    borderRadius: "6px",
    border: selected ? "2px solid #4a6cf7" : "2px solid transparent",
    background: selected ? "#eef1ff" : "transparent",
    cursor: "pointer",
    textAlign: "center",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
    display: "block",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#e53e3e",
    marginTop: "4px",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit} style={formStyle}>
        <TextField
          label="Category Name"
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError("");
          }}
          error={nameError}
          fullWidth
          required
          autoFocus
        />

        <div>
          <span style={labelStyle}>Emoji</span>
          <div style={emojiGridStyle}>
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                style={emojiBtnStyle(emoji === e)}
                onClick={() => {
                  setEmoji(e);
                  setEmojiError("");
                }}
              >
                {e}
              </button>
            ))}
          </div>
          {emojiError && <p style={errorStyle}>{emojiError}</p>}
        </div>

        <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : "Add Category"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
