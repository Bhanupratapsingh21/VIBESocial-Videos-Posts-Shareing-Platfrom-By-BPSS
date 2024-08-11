import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Headertwo from '../Components/Header2';
import Loadingvideo from "../Components/Videosloading.jsx";
import VideosLeyout from "../Components/Videosleylot.jsx";
import { useEffect, useState, useCallback } from 'react';

function Userwatchhistory() {
    const { status } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [error, setError] = useState({
        status: false,
        msg: ""
    });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    const getHistory = async (pageNum = 1) => {
        if (!status) {
            navigate("/");
            return;
        }

        setError({
            status: false,
            msg: ""
        });
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/users/history?page=${pageNum}&limit=10`, { withCredentials: true });
            setData(prevData => [...prevData, ...response.data.data.watchHistory]);
            setPage(response.data.data.page);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            setError({
                status: true,
                msg: error.response ? error.response.data.msg : "Error fetching data"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
        if (page < totalPages) {
            setIsFetching(true);
        }
    }, [isFetching, page, totalPages]);

    useEffect(() => {
        getHistory();
    }, []);

    useEffect(() => {
        if (isFetching && page < totalPages) {
            getHistory(page + 1).then(() => setIsFetching(false));
        }
    }, [isFetching, page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <>
            <Headertwo/>
            <div className="flex sm:mt-6 mt-6 mb-6 w-[85vw] sm:w-[70vw] items-center justify-between">
                <div>
                    <h2 className="text-4xl mb-6 sm:text-5xl font-bold text-black dark:text-gray-100">
                        Watch-History
                    </h2>
                    <p className='text-md sm:text-lg font-bold text-gray-100'></p>
                </div>
            </div>
            {error.status && (
                <p className="text-red-500">{error.msg}</p>
            )}
            {loading && page === 1 ? (
                <Loadingvideo totalno={9} />
            ) : (
                <VideosLeyout videodata={data} />
            )}
            {isFetching && (
                <div className="text-center mt-4 text-white">Loading more videos...</div>
            )}
        </>
    );
}

export default Userwatchhistory;
