function Loadingvideo({ totalno }) {
    let loading = [];
    for (let i = 0; i < totalno; i++) {
        loading.push(i);
    }

    return (
        <>
            <div className="grid  px-0 py-1 sm:pl-0 w-max gap-4 justify-center grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
                {
                    loading.map((i) => (
                        <div key={i}>
                            <div className="flex flex-col dark:bg-black px-4 w-[90vw] sm:w-80  h-72 animate-pulse rounded-xl p-4 gap-4">
                                <div className="bg-neutral-400/50 w-full h-72 animate-pulse rounded-md"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="animate-pulse bg-gray-500 h-12 w-12 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[200px]"> </div>
                                        <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[170px]"> </div>
                                        <div className="flex items-center">
                                            <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[57px]"></div>
                                            <div className="pb-1 mx-2">•</div>
                                            <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[47px]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Loadingvideo;
