export function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
            <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{label}</p>
                <p className="text-sm text-foreground font-medium truncate">{value}</p>
            </div>
        </div>
    );
}