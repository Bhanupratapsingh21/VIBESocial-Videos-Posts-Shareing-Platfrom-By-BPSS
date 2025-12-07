import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar.jsx';
import Header from './Components/Header.jsx';
import AllRoutes from './Routes/AllRoutes.jsx';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AuthLogin, AuthLogout } from './Store/features/Slice.js';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const refreshtokennewsessiongenrate = async (token) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/users/refreashtoken`,
        { token },
        { withCredentials: true }
      );

      dispatch(AuthLogin(response.data.data.data));
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      dispatch(AuthLogout());
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("refreshToken");

    if (data) {
      refreshtokennewsessiongenrate(data);
    } else {
      dispatch(AuthLogout());
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen bg-cyan-200 dark:bg-black">
      {!loading ? (
        <>
          <Header />

          {/* SIDEBAR FIXED LEFT */}
          <Sidebar />

          {/* MAIN CONTENT */}
          <main
            className="
              flex-1 mt-20
              sm:ml-[21vw]     /* FIX: same as sidebar width */
              overflow-y-auto
              scroll-hide scroll-smooth
              sm:border-l sm:rounded-t-lg shadow-md border-gray-500
              bg-white dark:bg-black dark:text-white
            "
          >
            <div className="sm:px-10 p-4 sm:py-6">
              <AllRoutes />
            </div>
          </main>
        </>
      ) : (
        <div className="flex w-[100vw] h-[100vh] text-white bg-black justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
            <h2 className="text-white mt-4">Loading...</h2>
            <p className="text-zinc-400 dark:text-zinc-400">
              Your Adventure is About To Begin
            </p>
            <h3>Jai Shri Ram</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

