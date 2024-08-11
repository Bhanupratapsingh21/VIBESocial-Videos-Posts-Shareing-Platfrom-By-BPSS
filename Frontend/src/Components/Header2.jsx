import { Link } from 'react-router-dom'
function Headertwo() {
    return (
        <>
            <div>
                <div class="flex bottom-0 z-30  fixed -ml-4 w-[100vw] sm:hidden border-t bg-white dark:bg-black h-11 items-center justify-around shadow-lg">
                    <Link to="/">
                        <button class="outline-none border-none w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out cursor-pointer hover:translate-y-[-3px]">
                            <svg class="w-6 h-5 dark:fill-white " stroke="currentColor" fill="black" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
                            </svg>
                        </button>
                    </Link>

                    <Link to="/videos">
                        <button class="outline-none border-none w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out cursor-pointer hover:translate-y-[-3px]">
                            <svg className="dark:fill-white" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height=""><path d="M22.903,6.538c-.676-.338-1.473-.267-2.077,.188-.039,.029-.076,.062-.11,.096l-1.757,1.773c-.211-2.565-2.341-4.594-4.959-4.594H5C2.243,4,0,6.243,0,9v6c0,2.757,2.243,5,5,5H14c2.629,0,4.768-2.047,4.962-4.627l1.756,1.754c.034,.033,.069,.063,.107,.092,.352,.264,.768,.398,1.188,.398,.303,0,.606-.069,.89-.211,.677-.338,1.097-1.019,1.097-1.774v-7.318c0-.757-.42-1.437-1.097-1.775Zm-8.903,11.462H5c-1.654,0-3-1.346-3-3v-6c0-1.654,1.346-3,3-3H14c1.654,0,3,1.346,3,3v6c0,1.654-1.346,3-3,3Zm5-5.417v-1.189l3-3.028,.025,7.238-3.025-3.022Z" /></svg>
                        </button>
                    </Link>
                   <Link to="/upload">
                   <button class="outline-none border-none w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out cursor-pointer hover:translate-y-[-3px]">
                        <svg className="dark:fill-white" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="18" height=""><path d="M17,12c0,.553-.448,1-1,1h-3v3c0,.553-.448,1-1,1s-1-.447-1-1v-3h-3c-.552,0-1-.447-1-1s.448-1,1-1h3v-3c0-.553,.448-1,1-1s1,.447,1,1v3h3c.552,0,1,.447,1,1Zm7-7v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-2,0c0-1.654-1.346-3-3-3H5c-1.654,0-3,1.346-3,3v14c0,1.654,1.346,3,3,3h14c1.654,0,3-1.346,3-3V5Z" /></svg>
                    </button>
                   </Link>

                    <Link to="/tweets">
                    <button class="outline-none border-none w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white transition-transform duration-300 ease-in-out cursor-pointer hover:translate-y-[-3px]">
                        <svg className="dark:fill-white" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height=""><path d="M19,2H5C2.24,2,0,4.24,0,7v10c0,2.76,2.24,5,5,5h14c2.76,0,5-2.24,5-5V7c0-2.76-2.24-5-5-5ZM5,4h14c1.65,0,3,1.35,3,3H2c0-1.65,1.35-3,3-3Zm14,16H5c-1.65,0-3-1.35-3-3V9H22v8c0,1.65-1.35,3-3,3ZM10,12c0,.55-.45,1-1,1h-1v4c0,.55-.45,1-1,1s-1-.45-1-1v-4h-1c-.55,0-1-.45-1-1s.45-1,1-1h4c.55,0,1,.45,1,1Zm10,0c0,.55-.45,1-1,1h-6c-.55,0-1-.45-1-1s.45-1,1-1h6c.55,0,1,.45,1,1Zm0,4c0,.55-.45,1-1,1h-6c-.55,0-1-.45-1-1s.45-1,1-1h6c.55,0,1,.45,1,1Z" /></svg>
                    </button>

                    </Link>
                </div>
            </div>
        </>
    )
}
export default Headertwo