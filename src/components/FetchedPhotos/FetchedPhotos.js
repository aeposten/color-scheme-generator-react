import "./FetchedPhotos.css";

function FetchedPhotos({ images }) {
  const photos = images.map((image) => (
    <a href={image.links.html} target="_blank" rel="noreferrer" key={image.id}>
      <div
        className="image-div"
        style={{ backgroundImage: `url(${image.urls.thumb})` }}
      ></div>
    </a>
  ));
  return <section className="fetched-photos">{photos}</section>;
}

export default FetchedPhotos;
