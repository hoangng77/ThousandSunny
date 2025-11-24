import PropTypes from 'prop-types'

export function Card({ image, title, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border-none w-full text-left">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-gray-700 font-medium">{title}</div>
    </div>
  );
}
Card.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export function ProgressCard({ image, title, genre }) {
  return (
    <button className="relative rounded-lg overflow-hidden shadow group border-none w-full text-left">
      
      {genre && (
        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {genre}
        </span>
      )}

      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover group-hover:opacity-90"
      />

      <div className="p-3 bg-white">
        <p className="font-medium text-sm">{title}</p>
      </div>
    </button>
  );
}
ProgressCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.string,
}

