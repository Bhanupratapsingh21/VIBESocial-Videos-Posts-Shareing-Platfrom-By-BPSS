import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import VideosLeyout from '../Components/Videosleylot';
import Loadingvideo from '../Components/Videosloading';
import { useParams } from 'react-router';
import Headertwo from '../Components/Header2';

const IndiPlaylist = () => {
    const { playlistid } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [name, setname] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const observer = useRef();

    const lastVideoElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        setLoading(true);
        setError(false);

        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/playlist/getplaylistId/${playlistid}`, {
                    params: { limit: 2, page },
                    withCredentials: true
                });

                setname({
                    name: response.data.data.Playlists[0].name,
                    description: response.data.data.Playlists[0].description
                });
                if (response.data.success) {
                    setData((prevData) => {
                        return [...new Set([...prevData, ...response.data.data.Playlists[0].videos.flat()])];
                    });
                    setHasMore(response.data.data.page < response.data.data.totalPages);

                } else {
                    throw new Error('Data fetch unsuccessful');
                }
            } catch (err) {
                console.log(err)
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [page]);

    return (
        <>  
            <Headertwo/>
            <div className="flex sm:mt-6 mt-6 mb-6 w-[85vw] sm:w-[70vw] items-center justify-between">
                <div>
                    <h2 className="text-4xl mb-6 sm:text-7xl font-bold text-gray-100">
                        {name.name}
                    </h2>
                    <p className='text-md sm:text-lg font-bold text-gray-100'>{name.description}</p>
                </div>
            </div>
            <div className='max-h-screen'>
                <VideosLeyout videodata={data} />
                {loading && <Loadingvideo totalno={9} />}
                <div ref={lastVideoElementRef} />
                {error && <div className="flex justify-center items-center">Pls Add videos In Your Playlist</div>}
            </div>
        </>
    );
};

export default IndiPlaylist;
