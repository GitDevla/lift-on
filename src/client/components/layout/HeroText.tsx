export default function HeroText({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-gray-400 mt-1">{subtitle}</p>
            </div>
        </div>
    );
}