export function CampaignCardSkeleton() {
    return (
        <article className="rounded-2xl border border-[#1C2333] bg-[#131B2A] px-4 py-5 sm:px-5">
            <div className="animate-pulse space-y-4">
                <div className="h-6 w-44 rounded-xl bg-[#1C2333]" />
                <div className="h-5 w-72 rounded-xl bg-[#1C2333]" />
                <div className="h-10 w-full rounded-xl bg-[#1C2333]" />
            </div>
        </article>
    );
}
