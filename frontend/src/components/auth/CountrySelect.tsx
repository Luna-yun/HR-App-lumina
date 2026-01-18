import { forwardRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASEAN_COUNTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export const CountrySelect = forwardRef<HTMLButtonElement, CountrySelectProps>(
  ({ value, onChange, placeholder = "Select country", disabled, error }, ref) => {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          className={cn(
            "h-12 px-4 text-base bg-card border-2 border-border/50 rounded-xl",
            "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10",
            "transition-all duration-200",
            "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/10"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            <Globe className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent 
          className="bg-card border-border/60 shadow-xl rounded-xl max-h-[280px] overflow-hidden z-[100]"
          position="popper"
          sideOffset={8}
        >
          {ASEAN_COUNTRIES.map((country) => (
            <SelectItem
              key={country.code}
              value={country.name}
              className="py-3 px-4 cursor-pointer focus:bg-primary/5 focus:text-foreground rounded-lg mx-1 my-0.5"
            >
              <span className="font-medium">{country.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

CountrySelect.displayName = "CountrySelect";
