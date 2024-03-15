# Video Transcoding Service

This repository contains a scalable video transcoding service, designed to handle video conversion and streaming efficiently. Built with FFMPEG, TypeScript, Express, and Node.js, this service integrates with AWS S3 for media storage and utilizes a Redis-based queue system for high scalability.

## Features

- Converts videos into multiple formats using ffmpeg
- Streams videos to AWS S3 for on-demand streaming
- Utilizes Redis-based queue system for high scalability
- Written entirely in TypeScript for type-safe development
- Easy integration with existing systems

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the server: `npm start`

## Contributing

Contributions are welcome! Please check the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
