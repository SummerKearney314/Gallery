import React, { useState, useRef } from "react";
import { database, CLOUD_NAME, UPLOAD_PRESET } from "./firebase";
import { ref, set, push } from "firebase/database";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(`Upload failed for ${file.name}: ${response.statusText}`);
  }

  return response.json();
};

const UploadImage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResults([]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    const newResults = [];

    for (const file of files) {
      try {
        const data = await uploadToCloudinary(file);
        if (data.secure_url) {
          const imagesRef = ref(database, "images");
          const newImageRef = push(imagesRef);
          await set(newImageRef, {
            url: data.secure_url,
            name: file.name,
            uploadedAt: Date.now(),
          });
          newResults.push({ name: file.name, url: data.secure_url, success: true });
        }
      } catch (error) {
        newResults.push({ name: file.name, success: false, error: error.message });
        console.error("Upload failed:", error);
      }
      setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    setResults(newResults);
    setFiles([]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ padding: "105px 20px 0" }}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        ref={inputRef}
      />
      <button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? `Uploading ${progress.done}/${progress.total}...` : "Upload"}
      </button>

      {files.length > 0 && !uploading && results.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Selected ({files.length} file{files.length > 1 ? "s" : ""})</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {files.map((f, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 4 }} />
                <p style={{ fontSize: 12, margin: 4, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Results</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {results.map((r, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                {r.success ? (
                  <img src={r.url} alt={r.name} style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 4 }} />
                ) : (
                  <div style={{ width: 150, height: 150, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: "red", fontSize: 12, padding: 4 }}>
                    {r.error || "Failed"}
                  </div>
                )}
                <p style={{ fontSize: 12, margin: 4, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
