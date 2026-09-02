import { FileResponse } from "@/types/File";
import Image from "next/image";

type Props = {
    file: FileResponse,
    onClick?: () => void
}

export default function FileCard({file, onClick}: Props) {

    const renderThumbnail = (name: string, url: string, type: string) => {
        if (type.includes('video')) {
            return <video src={url} width={150} height={150} autoPlay muted loop playsInline className="w-full h-full object-cover rounded-md">Your browser does not support the video tag.</video>
        } else {
            return <Image src={url} alt={name} width={150} height={150} className="object-cover rounded-md" unoptimized />
        }
    }

    return(
        <div className="w-37.5 h-37.5 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity" onClick={onClick}>
            {renderThumbnail(file.name_file, file.url as string, file.type)}
        </div>
    )
}