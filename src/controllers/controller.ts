import { Request, Response } from 'express';
import queue from '../services/queue.service';

class Controller {

    // controller to transcode video files
    public async transcodeController(request: Request, response: Response) {
        try {
            const { videoUrl, onSuccessEndpoint } = request.body;

            if (!videoUrl || !onSuccessEndpoint) {
                return response.status(400).json({
                    success: false,
                    message: 'videoUrl and onSuccessEndpoint are required.',
                });
            }

            await queue.add(`${Date.now()}`, { videoUrl, onSuccessEndpoint });

            return response.status(200).json({
                success: true,
                message: 'Video queued successfully.',
            });
        } catch (error: any) {
            return response.status(500).json({
                success: false,
                message: 'Error while transcoding the video.',
                error: error.message,
            });
        }
    };

};

export default new Controller();
