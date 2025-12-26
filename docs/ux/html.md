# VentoImage HTML Content Guide

## Basic HTML Content

Embed custom HTML content directly in your gallery:

```html
<div class="vento-image">
  <div>One</div>
  <div><strong>Two</strong></div>
  <div><em>Three</em></div>
</div>
```

## Selectable Text

Make text selectable by adding the `vento-image__select` class:

```html
<div class="vento-image">
  <div><span class="vento-image__select">One</span></div>
  <div><strong class="vento-image__select">Two</strong></div>
  <div><em class="vento-image__select">Three</em></div>
</div>
```

## Thumbnails for HTML Content

Add thumbnails for HTML content using `data-thumb`:

```html
<div class="vento-image" data-nav="thumbs">
  <div data-thumb="1_thumb.jpg">One</div>
  <div data-thumb="2_thumb.jpg"><strong>Two</strong></div>
  <div data-thumb="3_thumb.jpg"><em>Three</em></div>
</div>
```

### Custom Thumbnail Aspect Ratios

Control the aspect ratio of each thumbnail with `data-thumbratio`:

```html
<div class="vento-image" data-nav="thumbs">
  <div data-thumb="1_thumb.jpg" data-thumbratio="144/96">One</div>
  <div data-thumb="2_thumb.jpg" data-thumbratio="64/128"><strong>Two</strong></div>
  <div data-thumb="3_thumb.jpg" data-thumbratio="1"><em>Three</em></div>
</div>
```

## Combining HTML with Images

Use the `data-img` attribute to combine HTML content with background images:

```html
<div class="vento-image">
  <div data-img="1.jpg">One</div>
  <div data-img="2.jpg"><strong>Two</strong></div>
  <div data-img="3.jpg"><em>Three</em></div>
</div>
```

## Styling Tips

For custom HTML content, you may need to add your own CSS to ensure proper display:

```css
/* Example custom styles for HTML content */
.vento-image div[class^='vento-image__stage'] {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

/* Style for selectable text */
.vento-image__select {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}
```

## Best Practices

1. Keep HTML content concise for better performance
2. Use relative units (%, vw, vh) for responsive layouts
3. Test your gallery on different screen sizes
4. Consider accessibility when using custom HTML content
