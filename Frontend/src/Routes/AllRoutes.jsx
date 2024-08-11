import { Routes, Route } from "react-router-dom";
import Home from "../Screen's/Home.jsx";
import Tweets from "../Screen's/Tweets.jsx";
import Playlist from "../Screen's/Playlist.jsx";
import Subscription from "../Screen's/Subscriptions.jsx";
import Videos from "../Screen's/Videos.jsx";
import Userwatchhistory from "../Screen's/Watch-History.jsx"
import Profile from "../Screen's/Profile.jsx";
import IndividualVideo from "../Screen's/Individual.Video.jsx";
import Upload from "../Screen's/Uploadvideo.jsx";
import Editvideo from "../Screen's/VideoEditScreen.jsx";
import Userchannalstatus from "../Screen's/UserChannalstatus.jsx";
import Userprofile from "../Screen's/UserProfile.jsx";
import IndiPlaylist from "../Screen's/Individualplaylist.jsx";
import PrivateRoute from "./PrivateAuth.jsx"
import Searchforall from "../Screen's/Searchforall.jsx";
function AllRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/user/userprofile/:username" element={<Userprofile />} />
            <Route path="/video/:videoid" element={<IndividualVideo />} />
            <Route path="/search" element={<Searchforall />} />
            <Route path="/user/editprofile" element={
                <PrivateRoute>
                    <Profile />
                </PrivateRoute>
            } />
            <Route path="/userchannelstatus" element={
                <PrivateRoute>
                    <Userchannalstatus />
                </PrivateRoute>
            } />
            <Route path="/subscription" element={
                <PrivateRoute>
                    <Subscription />
                </PrivateRoute>
            } />

            <Route path="/editvideo/:videoid" element={
                <PrivateRoute>
                    <Editvideo />
                </PrivateRoute>
            } />
            <Route path="/playlist/:playlistid" element={
                <PrivateRoute>
                    <IndiPlaylist />
                </PrivateRoute>
            } />
            <Route path="/watch-history" element={
                <PrivateRoute>
                    <Userwatchhistory />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default AllRoutes;