import Group from '../models/groups.model.js';
import Institute from '../models/institute.model.js';

export const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find();
        res.status(200).json(institutes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addInstitute = async (req, res) => {
    const { instituteName, emailDomains } = req.body;

    if (!instituteName || !emailDomains) {
        return res.status(400).json({ message: "Institute name and email are required" });
    }

    try {
        // check if institute already exists
        const institute = await Institute.findOne({ instituteName });
        if (institute) {
            return res.status(400).json({ message: "Institute already exists" });
        }
        const newInstitute = new Institute({
            instituteName,
            emailDomains
		});

    // Create a group for the institute
		const group = new Group({
			groupName: "Institute Group",
			institute: newInstitute._id,
		});
		await group.save();
		const savedInstitute = await newInstitute.save();
		res.status(201).json(savedInstitute);
    } catch (error) {
        res.status(500).json({ message: "Error adding institute: " + error.message });
    }
};
