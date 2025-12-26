# VentoImage Video Support

## YouTube and Vimeo Videos

Easily embed videos by linking to their pages. VentoImage will automatically fetch the splash images:

```html
<div class="vento-image">
  <a href="https://youtube.com/watch?v=C3lWwBslWqg">Desert Rose</a>
  <a href="https://vimeo.com/61527416">Celestial Dynamics</a>
</div>
```

### Supported URL Formats

- YouTube: `https://youtube.com/watch?v=ID` or `https://youtu.be/ID`
- Vimeo: `https://vimeo.com/ID` or `https://player.vimeo.com/video/ID`

## Custom Splash Images

Use your own preview image for better control:

```html
<div class="vento-image">
  <a href="https://youtube.com/watch?v=C3lWwBslWqg">
    <img src="desert-rose.jpg" />
  </a>
</div>
```

## Custom Thumbnails for Videos

When using thumbnail navigation, specify a separate thumbnail image:

```html
<div class="vento-image" data-nav="thumbs">
  <a href="https://youtube.com/watch?v=C3lWwBslWqg" data-img="desert-rose.jpg">
    <img src="desert-rose_thumb.jpg" />
  </a>
</div>
```

## Custom Video Embeds

Embed videos from any platform that supports iframe embeds, such as Dailymotion:

```html
<div class="vento-image">
  <a href="https://dailymotion.com/embed/video/xxgmlg?autoplay=1" data-video="true">
    <img src="xxgmlg_preview.jpg" />
  </a>
  <a href="https://dailymotion.com/embed/video/xu4jqv?autoplay=1" data-video="true">
    <img src="xu4jqv_preview.jpg" />
  </a>
</div>
```

### Custom Video Implementation Notes:

1. Set `data-video="true"` to indicate this is a video element
2. The `href` should point to the iframe embed URL
3. Always include a preview image using the `<img>` tag
4. The `autoplay=1` parameter is optional but recommended for better UX

## Autoplay Behavior

Videos will play automatically when they become active in the gallery. To disable this behavior, remove the `autoplay` parameter from the video URL.

## Responsive Videos

All videos in VentoImage are fully responsive and will maintain their aspect ratio on different screen sizes.
