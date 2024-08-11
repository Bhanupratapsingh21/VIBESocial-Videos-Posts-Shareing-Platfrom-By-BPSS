import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import Loadingvideo from "../Components/Videosloading.jsx";
import VideosLeyout from "../Components/Videosleylot.jsx";
import Headertwo from "../Components/Header2.jsx";

function Videos() {
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [page, setpage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const observer = useRef();

    const getdata = async (page) => {
        try {
            setloading(true);
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/videos/getvideosadv?q=newestfirst&limit=10&page=${page}`);
            const videos = response.data.data.videos;
            setdata(prevData => [...prevData, ...videos]);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.log(error);
            seterror(true);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        getdata(page);
    }, [page]);

    const lastVideoElementRef = useRef();

    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages) {
                setpage(prevPage => prevPage + 1);
            }
        });
        if (lastVideoElementRef.current) {
            observer.current.observe(lastVideoElementRef.current);
        }
    }, [loading, page, totalPages]);

    return (
        <>
            <Headertwo />
            <div className="mb-4">
                <VideosLeyout videodata={data} />
                {loading && <Loadingvideo totalno={9} />}
                <div ref={lastVideoElementRef} />
                {error && <div className="flex justify-center items-center">Error loading videos. Please try again later.</div>}
            </div>

        </>
    );

}
export default Videos