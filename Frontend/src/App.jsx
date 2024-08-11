import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
import AllRoutes from './Routes/AllRoutes.jsx';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AuthLogin, AuthLogout } from './Store/features/Slice.js';
import Headertwo from './Components/Header2.jsx';
function App() {
  const [loading, setloading] = useState(true);
  const dispatch = useDispatch();

  const refreshtokennewsessiongenrate = async (token) => {
    setloading(true);
    try {

      const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/users/refreashtoken`, token, { withCredentials: true });
      // console.log(response.data.data.data)
      dispatch(AuthLogin(response.data.data.data))
      localStorage.setItem("refreshToken", response.data.refreshToken)
      setloading(false)
    } catch (error) {

      console.log("Guest Login")
      dispatch(AuthLogout());
      localStorage.setItem("refreshToken", null)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("refreshToken")
    if (data) {
      refreshtokennewsessiongenrate(data);
    } else {
      console.log("Guest Login")
      dispatch(AuthLogout());
    }
    setloading(false)
  }, [])

  return (
    <div className="flex h-screen justify-center bg-white dark:bg-black">
      {!loading ? (
        <>
          <Header />
          <Sidebar />
          <main className="flex-1 mt-20 sm:ml-72 overflow-y-auto border-t sm:border-l sm:rounded-xl border-gray-500  bg-white dark:bg-black dark:text-white">
            {/* Your main content goes here */}
            <div className="sm:px-10 p-4 sm:py-6">
              <AllRoutes />
            </div>
          
          </main>
        </>
      ) :
        <>
          <div className='flex w-[100vw] text-white bg-black justify-center items-center'>
            <div class="text-center">
              <div
                class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"
              ></div>
              <h2 class="text-white mt-4">Loading...</h2>
              <p class="text-zinc-400 dark:text-zinc-400">
                Your Adventure is About To Begin
                <h3>Jai Shri Ram</h3>
              </p>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
