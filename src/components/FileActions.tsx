"use client"; // Mark this as a Client Component

export default function FileActions({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
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
    // Implement your delete logic here
    console.log("Delete file:", url);
    // Example: Send a request to delete the file from the server
    // await fetch(`http://localhost:3000/api/deleteFile`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ url }),
    // });
    alert("Delete functionality to be implemented.");
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
