# Digital Influence Media Portal

Church media management portal for Digital Influence department.

## Gallery Images

The gallery is currently using placeholder images from Unsplash. To customize the gallery with your own images:

1. Open the file `client/src/components/home/gallery.tsx`
2. Find the `galleryItems` array
3. Replace the `imageUrl` values with URLs to your own images or local image paths

For local images:
- Save your images in the `client/src/assets/gallery` directory
- Import them at the top of the file
- Use the imported variables in the `imageUrl` fields

## Development

To start the development server:

```
npm run dev
```

## Building

To build the application:

```
npm run build
```

## Deployment

Follow standard deployment procedures for your hosting platform. 