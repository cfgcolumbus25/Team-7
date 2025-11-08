import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResearchTile } from "./ResearchTimeline.jsx";

export function TilePreviewDialog({
  open,
  onOpenChange,
  jsonData,
  onConfirm,
  onReject,
}) {
  const project = jsonData?.projects || {};
  const title = project.title || "Untitled Project";
  const impact = project.timeline_snippet || "No timeline available";
  const money = project.fund_usage?.amount_display 
    ? `$${project.fund_usage.amount_display}` 
    : "$0";
  const summary = project.layman_summary || "No summary available";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Research Tile</DialogTitle>
          <DialogDescription>
            Please review how this will appear and confirm if it looks correct
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <ResearchTile
            title={title}
            impact={impact}
            money={money}
            summary={summary}
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onReject}
            className="w-full sm:w-auto"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Not Correct
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Looks Good
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
