# VentoImage Captions Guide

## Basic Captions

Add captions to your gallery items using the `data-caption` attribute:

```html
<div class="vento-image">
  <img src="1.jpg" data-caption="Beautiful Landscape" />
  <img src="2.jpg" data-caption="City Skyline at Night" />
</div>
```

## HTML in Captions

Include rich text formatting in your captions using HTML:

```html
<div class="vento-image">
  <img src="1.jpg" data-caption="<strong>Beautiful</strong> <em>Landscape</em>" />
  <img
    src="2.jpg"
    data-caption="<span style='color: red;'>City</span> <span style='color: blue;'>Skyline</span>"
  />
</div>
```

## Caption Positioning

Control where captions appear using the `data-caption-position` attribute:

```html
<div class="vento-image" data-caption-position="bottom">
  <img src="1.jpg" data-caption="Bottom Caption" />
  <img src="2.jpg" data-caption-position="top" data-caption="Top Caption" />
  <img src="3.jpg" data-caption-position="middle" data-caption="Middle Caption" />
</div>
```

## Styling Captions

Customize the appearance of captions with CSS:

```css
/* Style all captions */
.vento-image__caption {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  font-size: 14px;
}

/* Style captions in specific positions differently */
.vento-image__caption--top {
  top: 10px;
  left: 10px;
  right: 10px;
  text-align: left;
}

.vento-image__caption--bottom {
  bottom: 10px;
  left: 10px;
  right: 10px;
  text-align: center;
}

.vento-image__caption--middle {
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
```

## Caption Animation

Add smooth animations when showing/hiding captions:

```css
.vento-image__caption {
  transition: opacity 0.3s ease;
  opacity: 0;
}

.vento-image__show-caption .vento-image__caption {
  opacity: 1;
}
```

## Best Practices

1. Keep captions concise and to the point
2. Use HTML sparingly for better performance
3. Ensure good contrast between text and background
4. Test captions on different screen sizes
5. Consider accessibility when using colored text or complex layouts

## Advanced: Dynamic Captions

Update captions dynamically using JavaScript:

```javascript
// Get the VentoImage instance
const gallery = document.querySelector('.vento-image');

// Update caption for the active item
gallery.addEventListener('vento-image:show', function (e) {
  const currentItem = e.detail.item;
  const caption = currentItem.getAttribute('data-caption');
  console.log('Current caption:', caption);

  // Example: Update an external element with the current caption
  document.getElementById('current-caption').textContent = caption || '';
});
```
