# Deepfake Detection Frontend

A modern React TypeScript frontend application for deepfake detection and analysis. This application provides a user-friendly interface for uploading media files, analyzing them for deepfake content, and viewing results.

## Features

- **User Authentication** - Secure login and registration system
- **File Upload** - Support for video/image upload and analysis
- **Real-time Messaging** - View analysis results and system messages
- **Protected Routes** - Secure access to authenticated features
- **Responsive Design** - Modern UI built with Tailwind CSS
- **Type Safety** - Full TypeScript support for better development experience

## Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 7.0.5
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.7.0
- **Icons**: Lucide React 0.344.0
- **Linting**: ESLint 9.12.0
- **Development**: Hot Module Replacement (HMR)

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (>= 18.0.0)
- **npm** (>= 8.0.0)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd factcheck-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Scripts

- **`npm run dev`** - Start the development server with hot reload
- **`npm run build`** - Build the project for production
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm audit fix`** - Fix security vulnerabilities in dependencies

## Project Structure

```
deepfake-fe/
├── src/
│   ├── components/          # React components
│   │   ├── Login.tsx       # Authentication component
│   │   ├── Upload.tsx      # File upload interface
│   │   ├── MessagesList.tsx # Messages display
│   │   ├── Navigation.tsx  # Navigation menu
│   │   └── PrivateRoute.tsx # Route protection
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state management
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Global type exports
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_URL=your_backend_api_url
VITE_APP_TITLE=Deepfake Detection
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### TypeScript

TypeScript configuration is defined in:
- `tsconfig.json` - Main TypeScript config
- `tsconfig.app.json` - Application-specific config
- `tsconfig.node.json` - Node.js specific config

## Authentication

The application includes a complete authentication system:

- Login/logout functionality
- Protected routes using `PrivateRoute` component
- Authentication state management via `AuthContext`
- Persistent authentication state

## File Upload

Upload component supports:
- Drag and drop file upload
- File type validation
- Progress tracking
- Error handling

## Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** for mobile and desktop
- **Modern UI components** with consistent design system
- **Dark/light mode** support (if implemented)

## Development

### Code Quality

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** (recommended for code formatting)

### Hot Module Replacement

Vite provides fast HMR for immediate feedback during development.

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts` or kill the process using port 5173
2. **Module not found**: Run `npm install` to ensure all dependencies are installed
3. **Build errors**: Check TypeScript errors with `npm run type-check`

### Performance Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with code splitting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing issues on GitHub
3. Create a new issue with detailed information

