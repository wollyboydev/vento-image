# VentoImage Dimensions Guide

## Basic Dimensions

VentoImage's dimensions are determined by the first image in the gallery. Other images are scaled proportionally to fit these dimensions. To reserve space on the page before the first image loads, use `data-width` and `data-height` attributes:

```html
<div class="vento-image" data-width="800" data-height="600">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

## Responsive Layout

To make VentoImage responsive, define the width in percentages and set the aspect ratio using `data-ratio`:

```html
<div class="vento-image" data-width="100%" data-ratio="800/600">
  <!-- Equivalent to data-ratio="4/3" or data-ratio="1.3333333333" -->
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

## Constrained Dimensions

Constrain VentoImage's size to specific ranges using minimum and maximum dimensions:

```html
<div
  class="vento-image"
  data-width="100%"
  data-ratio="800/600"
  data-minwidth="400"
  data-maxwidth="1000"
  data-minheight="300"
  data-maxheight="100%"
>
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

## Full-Window Gallery

To create a full-window gallery, set both width and height to 100% and ensure the body has no margins:

```html
<body style="margin: 0">
  <div class="vento-image" data-width="100%" data-height="100%">
    <img src="1.jpg" />
    <img src="2.jpg" />
  </div>
</body>
```

## Notes

- Relative height is calculated based on the inner height of the window
- When using percentage-based dimensions, ensure parent elements have defined heights
- The aspect ratio should match your image dimensions for best results
