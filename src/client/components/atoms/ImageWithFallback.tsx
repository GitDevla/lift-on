import { useState } from "react";
import { Image } from "@/client/lib/heroui";

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc = "https://placehold.co/180",
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            {...props}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
}   