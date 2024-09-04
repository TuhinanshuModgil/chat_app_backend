// write a model for image
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageSize: {
        type: Number,
        required: true
    }
});

const Image = mongoose.model('Image', imageSchema);

export default Image;