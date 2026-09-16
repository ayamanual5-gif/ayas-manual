"use client";

import { useRef, useState } from "react";
import type { DragEvent, FormEvent, MouseEvent } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { submitCustomOrder } from "@/lib/api";
import type { Category } from "@/lib/types";
import Reveal from "./motion/Reveal";
import { EASE } from "./motion/variants";

export default function CustomOrderSection({ categories }: { categories: Category[] }) {
  const { lang, t } = useLang();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(categories.find((c) => c.key !== "all")?.key ?? "");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const selectableCategories = categories.filter((c) => c.key !== "all");

  function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function removeImage(e: MouseEvent) {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("category", category);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      await submitCustomOrder(formData);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function resetForm() {
    setName("");
    setPhone("");
    setCategory(selectableCategories[0]?.key ?? "");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setStatus("idle");
  }

  return (
    <section className="py-16 sm:py-20" style={{ background: "var(--beige-100)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-xl mb-10">
          <span className="eyebrow" style={{ color: "var(--rose)" }}>
            {t("custom.eyebrow")}
          </span>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
            {t("custom.title")}
          </h2>
          <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
            {t("custom.sub")}
          </p>
        </Reveal>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="card p-8 text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "var(--teal)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--beige-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <h3 className="font-display mt-4 text-2xl" style={{ color: "var(--teal)" }}>
              {t("custom.successTitle")}
            </h3>
            <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
              {t("custom.successMsg")}
            </p>
            <button className="btn btn-outline mt-6 px-6 py-2.5" onClick={resetForm}>
              {t("custom.sendAnother")}
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
                {t("custom.uploadLabel")}
              </label>
              <motion.div
                animate={{ scale: dragging ? 1.02 : 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                className={`dropzone p-6 sm:p-8 text-center cursor-pointer${dragging ? " drag" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {!imagePreview ? (
                  <div>
                    <svg className="mx-auto" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--olive)" strokeWidth="1.7">
                      <path d="M12 16V4M7 9l5-5 5 5" />
                      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                    </svg>
                    <p className="mt-3 font-semibold">{t("custom.uploadTitle")}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>
                      {t("custom.uploadHint")}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} className="mx-auto rounded-2xl max-h-56 object-cover" alt="preview" />
                    <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                      {imageFile?.name}
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold underline"
                      style={{ color: "var(--rose)" }}
                      onClick={removeImage}
                    >
                      {t("custom.removeImg")}
                    </button>
                  </div>
                )}
              </motion.div>

              <div className="mt-6 card p-5">
                <p className="text-sm font-semibold" style={{ color: "var(--teal)" }}>
                  {t("custom.techTitle")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip">{t("tech1")}</span>
                  <span className="chip">{t("tech2")}</span>
                  <span className="chip">{t("tech3")}</span>
                  <span className="chip">{t("tech4")}</span>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="field">
                <label>{t("custom.labelName")}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("custom.phName")}
                />
              </div>
              <div className="field">
                <label>{t("custom.labelPhone")}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("custom.phPhone")}
                />
              </div>
              <div className="field">
                <label>{t("custom.labelCategory")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {selectableCategories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{t("custom.labelDesc")}</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("custom.phDesc")}
                />
              </div>

              {status === "error" && (
                <p className="text-sm" style={{ color: "var(--rose-600)" }}>
                  {t("custom.errorMsg")}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn btn-rose w-full py-3.5 disabled:opacity-60"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? t("custom.submitting") : t("custom.submit")}
              </motion.button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
