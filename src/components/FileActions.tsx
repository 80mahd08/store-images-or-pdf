"use client"; // Mark this as a Client Component

import Swal from "sweetalert2";
import { useEdgeStore } from "@/lib/edgestore"; // Import the EdgeStore client

export default function FileActions({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const { edgestore } = useEdgeStore(); // Initialize the EdgeStore client

  // Function to handle file download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle file deletion
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Send the deletion request to your backend API to remove the file information from Prisma
        const prismaResponse = await fetch("/api/deleteFile", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (prismaResponse.ok) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          window.location.reload();
        } else {
          const errorData = await prismaResponse.json();
          Swal.fire(
            "Error!",
            errorData.error || "Failed to delete file.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error during deletion:", error);
        Swal.fire("Error!", "Failed to delete file.", "error");
      }
    }
  };
  return (
    <div className="file-actions">
      <button className="download-btn" onClick={handleDownload}>
        Download
      </button>
      <button className="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
