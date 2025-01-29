import { cn } from "@/lib/utils";
import { Bird } from "lucide-react"; // Import the bird icon

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

export const LoadingSpinner = ({
    size = 100,
    className,
    ...props
}: ISVGProps) => {
    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Rotating Spinner Circle */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                {...props}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("animate-spin", className)}
            >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>

            {/* Centered Bird Icon */}
            <Bird
                className="absolute"
                size={size * 0.45} // Adjust icon size relative to spinner
                strokeWidth="1.75"
            />
        </div>
    );
};