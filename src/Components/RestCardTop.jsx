// A dish category in the "What's on your mind?" row
export default function RestCardTop({ restInfoTop }) {
    return (
        <img
            className="w-24 h-24 md:w-32 md:h-32 object-contain mt-4"
            loading="lazy"
            src={`https://media-assets.swiggy.com/swiggy/image/upload/${restInfoTop.imageId}`}
            alt={restInfoTop?.action?.text || "Food category"}
        />
    )
}
