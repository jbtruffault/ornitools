import { CircleCheck , CircleX } from "lucide-react";
import { Label } from "@/components/ui/label";

export const DetailField = ({ label, content }: { label: string; content: string | number | JSX.Element }) => (
    <div className="mt-3">
        <Label htmlFor={label} >{label}</Label>
        <p id={label} className="text-gray-700">{content}</p>
    </div>
    );

export const BooleanField = ({ label, value }: { label: string; value: boolean }) => (
    <div className="mt-3 flex items-center">
        <Label htmlFor={label}>{label}</Label>
        <div className="ml-2">
        {value ? (
            <CircleCheck className="text-green-500" size={20} />
        ) : (
            <CircleX className="text-red-500" size={20} />
        )}
        </div>
    </div>
    );