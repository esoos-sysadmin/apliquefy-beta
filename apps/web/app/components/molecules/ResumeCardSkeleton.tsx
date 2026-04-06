export function ResumeCardSkeleton() {
    return (
        <article className="flex min-h-[220px] animate-pulse overflow-hidden rounded-2xl border border-[#1C2333] bg-[#131B2A]">
            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                    <div className="h-6 w-20 rounded-full bg-[#1C2333]" />
                    <div className="h-7 w-2/3 rounded-xl bg-[#1C2333]" />
                    <div className="h-5 w-1/2 rounded-xl bg-[#1C2333]" />
                    <div className="h-4 w-1/3 rounded-xl bg-[#1C2333]" />
                </div>
                <div className="mt-6 h-11 w-36 rounded-xl bg-[#1C2333]" />
            </div>
            <div className="hidden w-44 shrink-0 border-l border-[#1C2333] bg-[#101826] lg:block" />
        </article>
    );
}
