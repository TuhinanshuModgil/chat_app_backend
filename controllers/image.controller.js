// write a controller for image
import Image from "../models/image.model";

export const addImage = async (req, res) => {
    try {
        const image = await Image.create(req.body);
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}