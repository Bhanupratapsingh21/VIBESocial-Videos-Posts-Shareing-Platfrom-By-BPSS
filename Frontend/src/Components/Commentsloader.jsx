import React from 'react';

function LoadingComment({ totalNo }) {
    return (
        <div>
            {Array.from({ length: totalNo }).map((_, index) => (
                <div class="relative flex w-[90vw] sm:w-72 animate-pulse gap-2 p-4">
                    <div class="h-12 w-12 rounded-full bg-slate-400"></div>
                    <div class="flex-1">
                        <div class="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                        <div class="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LoadingComment;
