import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArtPage() {
  const { id } = useParams(); 
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`http://localhost:5000/artist/content/${id}`);
        const data = await res.json();
        setMedia(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!media) return <div>Media not found</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{media.title}</h1>
      <img
        src={`http://localhost:5000${media.fileUrl}`}
        alt={media.title}
        className="max-w-3xl w-full rounded shadow mb-4"
      />
      <p className="text-gray-700 mb-2">{media.description}</p>
      <p className="text-gray-500 text-sm">
        Uploaded on: {new Date(media.createdAt).toLocaleDateString()}
      </p>
    </div>
    // todo: comments
  );
}
