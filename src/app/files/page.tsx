import { currentUser } from "@clerk/nextjs/server";
import FileActions from "@/components/FileActions"; // Import the Client Component
import { convertBytesToReadable } from "@/lib/functions";
import Image from "next/image";
import placeHolder from "../../../public/placeholder.png";

export default async function Page() {
  // Get the authenticated user's information
  const user = await currentUser();

  const imageLoader = ({ src }: { src: string }) => {
    return src; // Bypasses Next.js image optimization
  };

  // Extract the userId
  const userId = user?.id;

  // Use the userId in your fetch request
  const res = await fetch("http://localhost:3000/api/getImages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();

  return (
    <div className="file-container">
      {data.map((file: { url: string; name: string; size: number }) => (
        <div key={file.url} className="file-card">
          {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <img
              src={file.url}
              alt={file.name}
              className="file-image"
              width={200}
              height={150}
            />
          ) : (
            <Image
              src={placeHolder}
              alt="Placeholder"
              className="file-image"
              width={200}
              height={150}
            />
          )}
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{convertBytesToReadable(file.size)}</p>
            <FileActions url={file.url} name={file.name} />
          </div>
        </div>
      ))}
    </div>
  );
}
