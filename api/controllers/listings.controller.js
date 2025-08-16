import User from '../models/user.js';

export const filterUsers = async (req, res, next) => {
    try {
        const { searchTerm, course, university, year, location } = req.query;
        
        let query = {};
        
        if (searchTerm) {
            query.$or = [
                { fullname: { $regex: searchTerm, $options: "i" } },
                { major: { $regex: searchTerm, $options: "i" } }
            ];
        }

        if (course) {
            query.courses = { $in: [new RegExp(course, 'i')] };
        }

        if (university && university !== '') {
             query.university = { $regex: university, $options: 'i' };
        }

        if (year && year !== 'All years') {
            query.year = year;
        }

        if (location && location !== 'Any location') {
            query.location = location;
        }

        const filteredUsers = await User.find(query);

        return res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error fetching filtered users:", error);
        next(error); 
    }
};