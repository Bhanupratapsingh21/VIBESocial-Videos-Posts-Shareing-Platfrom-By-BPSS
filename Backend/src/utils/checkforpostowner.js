import mongoose from "mongoose";

function verifypostowner(blog_onwer_id, current_user_id) {
    
    const ObjectId = mongoose.Types.ObjectId;
    // Convert both IDs to ObjectId for comparison
    const userId = new ObjectId(current_user_id);
    const blogOwnerId = new ObjectId(blog_onwer_id);
    // Use the .equals() method to compare ObjectIDs
    if (!userId.equals(blogOwnerId)) {
        return false
        // res.status(401).json({ "MSG": "You Are Not The Owner Of This Blog" });
    }
    return true

}

export default verifypostowner;
