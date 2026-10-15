export function ResumeCardSkeleton() {
    return (
        <article className="flex min-h-[220px] animate-pulse overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                    <div className="h-6 w-20 rounded-full bg-raised" />
                    <div className="h-7 w-2/3 rounded-xl bg-raised" />
                    <div className="h-5 w-1/2 rounded-xl bg-raised" />
                    <div className="h-4 w-1/3 rounded-xl bg-raised" />
                </div>
                <div className="mt-6 h-11 w-36 rounded-xl bg-raised" />
            </div>
            <div className="hidden w-44 shrink-0 border-l border-line bg-sunken lg:block" />
        </article>
    );
}
