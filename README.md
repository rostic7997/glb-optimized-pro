# GLB Optimizer Pro

A professional 3D model optimization tool that reduces file sizes, optimizes meshes, and compresses textures while maintaining visual quality. Perfect for web applications, games, and AR/VR experiences.

[GLB Optimizer Pro](https://glboptimized-pro.netlify.app)

## 🚀 Features

- **Smart GLB/GLTF Optimization**: Reduce polygon count while preserving model integrity
- **Texture Compression**: Optimize textures with quality control (High/Medium/Low)
- **Draco Compression**: Advanced geometry compression with configurable levels
- **Real-time 3D Preview**: Interactive side-by-side comparison with wireframe mode
- **GitHub Authentication**: Track your optimization statistics and history
- **Batch Processing**: Handle GLTF projects with multiple texture files
- **Safe Processing**: Validates files before and after optimization
- **User Statistics**: Track polygons reduced, textures optimized, and storage saved

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Processing**: Three.js, React Three Fiber, @gltf-transform
- **Animation**: Framer Motion
- **Authentication**: GitHub OAuth
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebGL support
- GitHub account (for authentication features)

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rostic7997/glb-optimized-pro.git
   cd glb-optimizer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🔐 GitHub Authentication Setup

To enable user authentication and statistics tracking:

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `GLB Optimizer Pro`
   - **Homepage URL**: `https://yourdomain.com` (or `http://localhost:5173` for local)
   - **Authorization callback URL**: `https://yourdomain.com` (same as homepage)
4. Click "Register application"

### 2. Configure Authentication

1. Copy your **Client ID** from the GitHub OAuth app
2. Generate a new **Client Secret**
3. Update `src/contexts/AuthContext.tsx`:

```typescript
// Replace this line:
const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';

// And add your client secret in the handleOAuthCallback function:
client_secret: 'YOUR_GITHUB_CLIENT_SECRET',
```

⚠️ **Security Note**: Never commit client secrets to public repositories. For production, use environment variables or a backend service.

### 3. Environment Variables (Recommended)

Create a `.env` file in the root directory:

```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_GITHUB_CLIENT_SECRET=your_client_secret_here
```

Then update the AuthContext to use environment variables:

```typescript
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
```

## 🌐 Deployment Options

### Netlify (Recommended)

1. **Automatic Deployment**
   - Fork this repository
   - Connect your GitHub account to Netlify
   - Import the repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

2. **Manual Deployment**
   ```bash
   npm run build
   # Upload the 'dist' folder to Netlify
   ```

3. **Environment Variables on Netlify**
   - Go to Site Settings → Environment Variables
   - Add `VITE_GITHUB_CLIENT_ID` and `VITE_GITHUB_CLIENT_SECRET`

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🎯 Usage Guide

### Basic Optimization

1. **Upload a GLB file** or **GLTF project with textures**
2. **Adjust optimization settings**:
   - Mesh Decimation: 0-100% polygon reduction
   - Texture Quality: High/Medium/Low compression
   - Draco Compression: Enable with level 1-10
3. **Click "Optimize Model"**
4. **Preview results** in the 3D viewer
5. **Download optimized file**

### Advanced Features

- **Wireframe Mode**: Toggle to see mesh structure
- **Side-by-side Comparison**: Compare original vs optimized
- **Statistics Tracking**: View your optimization history (requires login)
- **Batch Processing**: Upload GLTF folders with multiple textures

## 📊 File Format Support

| Format | Input | Output | Notes |
|--------|-------|--------|-------|
| GLB | ✅ | ✅ | Binary GLTF, recommended |
| GLTF + Textures | ✅ | ✅ | Converted to GLB output |
| Max File Size | 500MB | - | Per upload session |

## 🔧 Configuration

### Optimization Settings

```typescript
interface OptimizationSettings {
  meshDecimation: number;        // 0-100% polygon reduction
  textureQuality: 'high' | 'medium' | 'low';
  dracoCompression: {
    enabled: boolean;
    level: number;               // 1-10 compression level
  };
  wireframeMode: boolean;
}
```

### Supported Texture Formats

- PNG, JPG, JPEG, WebP
- Automatic format conversion and compression
- Resolution scaling based on quality settings

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid GLB file format"**
   - Ensure file is a valid GLB/GLTF
   - Check file isn't corrupted
   - Try with a smaller file first

2. **"Optimization failed"**
   - Reduce optimization settings
   - Check browser console for errors
   - Ensure sufficient memory available

3. **Authentication not working**
   - Verify GitHub OAuth app configuration
   - Check redirect URLs match exactly
   - Clear browser cache and localStorage

4. **3D preview not loading**
   - Ensure WebGL is enabled in browser
   - Update graphics drivers
   - Try in a different browser

### Performance Tips

- Use GLB format for better performance
- Start with conservative optimization settings
- Close other browser tabs for large files
- Use Chrome or Firefox for best WebGL support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [glTF-Transform](https://gltf-transform.donmccurdy.com/) for 3D optimization
- [Three.js](https://threejs.org/) for 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/glb-optimizer-pro/issues)
- 💬 [Discussions](https://github.com/yourusername/glb-optimizer-pro/discussions)
- 📧 Email: your-email@example.com

---

**Made with ❤️ for the 3D development community**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/glb-optimizer-pro)
