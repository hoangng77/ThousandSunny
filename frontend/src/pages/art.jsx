import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArtPage() {
  const { id } = useParams(); 
  const [media, setMedia] = useState(null);
  const [artist, setArtist] = useState(null);
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

 useEffect(() => {
    const fetchArtist = async () => {
      try {
        if (media) {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:5000/artist/${media.artist}`,
             { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          setArtist(data);
          console.log("Artist data:", data);
        }
      } catch (err) {
        console.error("Error fetching artist:", err);
      }
    };
    fetchArtist();
  }, [media]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading artwork...</p>
      </div>
    </div>
  );
  if (!media) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <p className="text-gray-600 text-lg">Artwork not found</p>
    </div>
  );
  if (!artist) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <p className="text-gray-600 text-lg">Artist information unavailable</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{media.title}</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
        </div>

        {/* Image Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img
              src={`http://localhost:5000/${media.fileUrl}`}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">{media.description}</p>
          </div>

          {/* Artist Info */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Artist</p>
                <p className="text-xl font-semibold text-gray-900">{artist.artist.username}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Uploaded</p>
                <p className="text-lg text-gray-700">{new Date(media.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // todo: comments
  );
}
