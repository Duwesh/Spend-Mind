import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Loading data...
      </p>
    </div>
  );
}
