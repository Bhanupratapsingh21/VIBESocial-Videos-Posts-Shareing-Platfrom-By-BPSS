import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import TweetsLeyout from "../Components/TweetsLeylot.jsx";
import Loadingvideo from "../Components/Videosloading.jsx";
import { useSelector } from 'react-redux'
import Headertwo from "../Components/Header2.jsx";
function Tweets() {
    const { status, userdata } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const observer = useRef();

    const getData = async (page) => {
        setLoading(true);
        try {

            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/tweets/getblogsadv?q=newestfirst&limit=10&page=${page}`, { withCredentials: true });
            console.log(response.data.data.blogs)
            const tweets = response.data.data.blogs;
            setData(prevData => {
                const posts = [...prevData, ...tweets];
                const seenIds = new Set();
                // Filter out duplicate posts based on _id
                const filteredData = posts.filter(post => {
                    if (seenIds.has(post._id)) {
                        return false;
                    } else {
                        seenIds.add(post._id);
                        return true;
                    }
                });
                return filteredData;
            });
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.log(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const filterondelete = (_id) => {
        const newdata = data.filter(post => post._id !== _id)
        setData(newdata);
    }

    useEffect(() => {
        getData(page);
    }, [page, status]);

    const lastTweetElementRef = useRef();

    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (lastTweetElementRef.current) {
            observer.current.observe(lastTweetElementRef.current);
        }
    }, [loading, page, totalPages]);

    return (
        <>
            <Headertwo />
            <TweetsLeyout filterondelete={filterondelete} tweetsdata={data} />
            {loading && <Loadingvideo totalno={9} />}
            <div ref={lastTweetElementRef} />
            {error && <div className="flex justify-center">Error loading tweets. Please try again later.</div>}
        </>
    );
}

export default Tweets;
