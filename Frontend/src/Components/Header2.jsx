import { Link } from 'react-router-dom'

import {
    IconArrowLeft,
    IconBrandStocktwits,
    IconMenu2,
    IconUpload,
    IconLogout2,
    IconHistory,
    IconBrandStripe,
    IconPlaylist,
    IconVideoPlus,
    IconDatabaseImport,
    IconHome,
} from "@tabler/icons-react";
function Headertwo() {
    return (
        <>
            <div>
                <div class="flex bottom-0 z-30  fixed -ml-4 w-[100vw] sm:hidden border-t bg-white dark:bg-black h-11 items-center justify-around shadow-lg">
                    <Link to="/">
                        <button class="outline-none border-none w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out cursor-pointer hover:translate-y-[-3px]">
                            <IconHome className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        </button>
                    </Link>

                    <Link to="/videos">
                        <IconVideoPlus className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    </Link>
                    <Link to="/upload">
                        <IconUpload className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    </Link>

                    <Link to="/tweets">
                        <IconBrandStocktwits className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />

                    </Link>
                    <Link
                        to={"/playlist"}
                    >
                        <IconPlaylist className="text-black-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />

                    </Link>
                </div>
            </div>
        </>
    )
}
export default Headertwo