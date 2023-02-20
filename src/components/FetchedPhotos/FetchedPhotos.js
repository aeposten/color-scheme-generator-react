import "./FetchedPhotos.css"

function FetchedPhotos({images}) {
    const photos = images.map((image) => (
        <img src={image.urls.thumb} key={image.id} alt={image.description} />
    ))
    return (
        <section>
            {photos}
        </section>
    )
}

export default FetchedPhotos;