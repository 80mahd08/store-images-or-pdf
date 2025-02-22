"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { useEdgeStore } from "@/lib/edgestore"; // Import the EdgeStore client
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { edgestore } = useEdgeStore(); // Initialize the EdgeStore client

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      Swal.fire({
        title: "No Files Selected",
        text: "Please select at least one file first!",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const res = await fetch("/api/getUser");
      const resResp = await res.json();

      // Upload each file to EdgeStore
      for (const file of files) {
        const res = await edgestore.isProtected.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress);
          },
        });

        // Once the file is uploaded, store the file information in Prisma
        const fileInfo = {
          url: res.url,
          name: file.name,
          size: res.size,
          userId: resResp?.currentUser, // Replace with the actual user ID
        };

        // Send the file information to your backend API to store in Prisma
        const prismaResponse = await fetch("/api/uplode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fileInfo),
        });

        if (!prismaResponse.ok) {
          throw new Error("Failed to store file information in Prisma");
        }
      }
      setProgress(0);
      setFiles(null);
      Swal.fire({
        title: "Success",
        text: "Files uploaded and stored successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to upload or store files.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="main">
      <div className="container">
        <h1>Home</h1>

        <Dropzone
          onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".gif"], // Image formats
            "application/pdf": [".pdf"], // PDF
            "application/msword": [".doc"], // Older Word documents
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"], // Newer Word documents
            "application/rtf": [".rtf"], // Rich Text Format
            "application/vnd.oasis.opendocument.text": [".odt"], // OpenDocument Text
            "application/vnd.ms-powerpoint": [".ppt"], // Older PowerPoint presentations
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
              [".pptx"], // Newer PowerPoint presentations
            "application/vnd.ms-excel": [".xls"], // Older Excel spreadsheets
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"], // Newer Excel spreadsheets
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <div>
                  Drag and drop files here, or click to select files (number of
                  files selected is {files?.length || 0})
                </div>
              </div>
            </section>
          )}
        </Dropzone>

        <p style={{ color: "var(--fifth-color)", textAlign: "center" }}>
          Accepted formats: Images, PDF, DOC, DOCX, RTF, ODT, PPT, PPTX, XLS,
          XLSX
        </p>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <span style={{ marginBottom: "20px", color: "var(--fifth-color)" }}>
          %{progress}
        </span>
        <button
          className="uplode-btn"
          onClick={handleSubmit}
          disabled={!files || files.length === 0}
        >
          Upload Files
        </button>
      </div>
    </div>
  );
}
