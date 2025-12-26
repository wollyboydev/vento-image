# VentoImage Options

## Options Reference

Options can be passed via data attributes or JavaScript:

```html
<div
  class="vento-image"
  data-width="700"
  data-maxwidth="100%"
  data-ratio="16/9"
  data-allowfullscreen="true"
  data-nav="thumbs"
>
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

Or via JavaScript:

```javascript
$('.vento-image').VentoImage({
  width: 700,
  maxwidth: '100%',
  ratio: 16 / 9,
  allowfullscreen: true,
  nav: 'thumbs',
});
```

### Basic Options

| Option                                           | Type              | Default   | Description                                                     |
| ------------------------------------------------ | ----------------- | --------- | --------------------------------------------------------------- |
| [`width`](#width)                                | Number or String  | -         | Stage container width in pixels or percents                     |
| [`minwidth`](#minwidth)                          | Number or String  | -         | Stage container minimum width in pixels or percents             |
| [`maxwidth`](#maxwidth)                          | Number or String  | -         | Stage container maximum width in pixels or percents             |
| [`height`](#height)                              | Number or String  | -         | Stage container height in pixels or percents                    |
| [`minheight`](#minheight)                        | Number or String  | -         | Stage container minimum height in pixels or percents            |
| [`maxheight`](#maxheight)                        | Number or String  | -         | Stage container maximum height in pixels or percents            |
| [`ratio`](#ratio)                                | Number or String  | -         | Width divided by height. Recommended if using percentage width  |
| [`margin`](#margin)                              | Number            | -         | Horizontal margins for frames in pixels                         |
| [`glimpse`](#glimpse)                            | Number or String  | -         | Glimpse size of nearby frames in pixels or percents             |
| [`nav`](#navigation)                             | String or Boolean | 'dots'    | Navigation style: 'dots', 'thumbs', or false                    |
| [`navposition`](#navigation-position)            | String            | 'bottom'  | Navigation position: 'bottom' or 'top'                          |
| [`navwidth`](#navigation-width)                  | String            | -         | Navigation container width in pixels or percents                |
| [`thumbwidth`](#thumbnail-width)                 | Number            | -         | Thumbnail width in pixels                                       |
| [`thumbheight`](#thumbnail-height)               | Number            | -         | Thumbnail height in pixels                                      |
| [`thumbmargin`](#thumbnail-margin)               | Number            | -         | Size of thumbnail margins                                       |
| [`thumbborderwidth`](#thumbnail-border-width)    | Number            | -         | Border width of the active thumbnail                            |
| [`allowfullscreen`](#allow-fullscreen)           | Boolean or String | false     | Enable fullscreen mode: true, false, or 'native'                |
| [`fit`](#fit)                                    | String            | 'contain' | How to fit an image: 'contain', 'cover', 'scaledown', or 'none' |
| [`thumbfit`](#thumbnail-fit)                     | String            | 'cover'   | How to fit thumbnail into its frame                             |
| [`transition`](#transition)                      | String            | 'slide'   | Transition effect: 'slide', 'crossfade', or 'dissolve'          |
| [`clicktransition`](#click-transition)           | String            | -         | Alternative transition to use on click                          |
| [`transitionduration`](#transition-duration)     | Number            | -         | Animation length in milliseconds                                |
| [`captions`](#captions)                          | Boolean           | true      | Show/hide captions                                              |
| [`hash`](#hash-navigation)                       | Boolean           | false     | Enable URL hash navigation                                      |
| [`startindex`](#start-index)                     | Number or String  | 0         | Index or id of the initial frame                                |
| [`loop`](#loop)                                  | Boolean           | false     | Enable infinite loop                                            |
| [`autoplay`](#autoplay)                          | Boolean or Number | false     | Enable slideshow with optional interval in ms                   |
| [`stopautoplayontouch`](#stop-autoplay-on-touch) | Boolean           | false     | Stop slideshow on user interaction                              |
| [`keyboard`](#keyboard)                          | Boolean or Object | false     | Enable keyboard navigation                                      |
| [`arrows`](#arrows)                              | Boolean or String | true      | Show navigation arrows: true, false, or 'always'                |
| [`click`](#click)                                | Boolean           | true      | Enable frame navigation by clicking                             |
| [`swipe`](#swipe)                                | Boolean           | true      | Enable swipe gestures                                           |
| [`trackpad`](#trackpad)                          | Boolean           | false     | Enable trackpad and mouse wheel support                         |
| [`shuffle`](#shuffle)                            | Boolean           | false     | Shuffle frames on load                                          |
| [`direction`](#right-to-left-rtl-support)        | String            | 'ltr'     | Text direction: 'ltr' or 'rtl'                                  |
| [`shadows`](#shadows)                            | Boolean           | true      | Enable shadows                                                  |

### Defaults

Override defaults by defining `ventoImageDefaults` before loading VentoImage:

```html
<script>
  ventoImageDefaults = {
    width: 700,
    maxwidth: '100%',
    ratio: 16 / 9,
    allowfullscreen: true,
    nav: 'thumbs',
  };
</script>
<script src="path/to/vento-image.js"></script>
```

## Detailed Options

### Width

Set the width of the gallery container using the `data-width` attribute:

- **Type:** Number | String
- **Default:** Auto (determined by first image)
- **Values:** Pixel values (e.g., `700`) or percentages (e.g., `'100%'`)
- **Description:** Controls the width of the gallery stage container. Can be fixed pixels or responsive percentages.

#### Fixed Width

Set a fixed width in pixels:

```html
<div class="vento-image" data-width="700">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive Width

Use percentage-based width for responsive galleries:

```html
<div class="vento-image" data-width="100%">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Combined with Ratio

For responsive layouts, combine width with aspect ratio:

```html
<div class="vento-image" data-width="100%" data-ratio="16/9">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use fixed pixels for desktop-only galleries
- Use percentages with `data-ratio` for responsive designs
- Combine with `data-maxwidth` and `data-minwidth` for constrained layouts
- Test on various screen sizes to ensure proper display

### Min Width

Set the minimum width constraint for the gallery using the `data-minwidth` attribute:

- **Type:** Number | String
- **Default:** None
- **Values:** Pixel values (e.g., `400`) or percentages (e.g., `'50%'`)
- **Description:** Prevents the gallery from becoming narrower than the specified value. Useful for responsive designs.

#### Fixed Minimum Width

Set a minimum width in pixels:

```html
<div class="vento-image" data-width="100%" data-minwidth="400">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive with Constraints

Combine with percentage width for flexible layouts:

```html
<div
  class="vento-image"
  data-width="100%"
  data-minwidth="300"
  data-maxwidth="1200"
  data-ratio="16/9"
>
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use with percentage width for responsive galleries
- Set minimum width to ensure readability on small screens
- Combine with `data-maxwidth` for constrained layouts
- Test on mobile devices to ensure proper minimum width

### Max Width

Set the maximum width constraint for the gallery using the `data-maxwidth` attribute:

- **Type:** Number | String
- **Default:** None
- **Values:** Pixel values (e.g., `1200`) or percentages (e.g., `'100%'`)
- **Description:** Prevents the gallery from becoming wider than the specified value. Useful for limiting gallery size on large screens.

#### Fixed Maximum Width

Set a maximum width in pixels:

```html
<div class="vento-image" data-width="100%" data-maxwidth="1200">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive with Constraints

Combine with percentage width for flexible layouts:

```html
<div
  class="vento-image"
  data-width="100%"
  data-minwidth="300"
  data-maxwidth="1200"
  data-ratio="16/9"
>
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use with percentage width for responsive galleries
- Set maximum width to prevent oversizing on large screens
- Combine with `data-minwidth` for constrained layouts
- Test on desktop and mobile to ensure proper maximum width

### Height

Set the height of the gallery container using the `data-height` attribute:

- **Type:** Number | String
- **Default:** Auto (determined by first image)
- **Values:** Pixel values (e.g., `500`) or percentages (e.g., `'100%'`)
- **Description:** Controls the height of the gallery stage container. Can be fixed pixels or responsive percentages.

#### Fixed Height

Set a fixed height in pixels:

```html
<div class="vento-image" data-height="500">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive Height

Use percentage-based height for responsive galleries:

```html
<div class="vento-image" data-height="100%">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Combined with Width and Ratio

For precise control, combine width, height, and ratio:

```html
<div class="vento-image" data-width="100%" data-height="600" data-ratio="16/9">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use fixed pixels for specific aspect ratio requirements
- Use percentages for full-viewport galleries
- Combine with `data-minheight` and `data-maxheight` for flexible layouts
- Always test on mobile devices for proper display

### Min Height

Set the minimum height constraint for the gallery using the `data-minheight` attribute:

- **Type:** Number | String
- **Default:** None
- **Values:** Pixel values (e.g., `300`) or percentages (e.g., `'50%'`)
- **Description:** Prevents the gallery from becoming shorter than the specified value. Useful for maintaining visibility.

#### Fixed Minimum Height

```html
<div class="vento-image" data-height="100%" data-minheight="300">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use with percentage height for responsive galleries
- Set minimum height to ensure gallery remains visible on small screens
- Combine with `data-maxheight` for flexible layouts

### Max Height

Set the maximum height constraint for the gallery using the `data-maxheight` attribute:

- **Type:** Number | String
- **Default:** None
- **Values:** Pixel values (e.g., `800`) or percentages (e.g., `'100%'`)
- **Description:** Prevents the gallery from becoming taller than the specified value. Useful for limiting gallery size.

#### Fixed Maximum Height

```html
<div class="vento-image" data-height="100%" data-maxheight="800">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use with percentage height for responsive galleries
- Set maximum height to prevent oversizing on large screens
- Combine with `data-minheight` for constrained layouts

### Margin

Set the margin around the gallery container using the `data-margin` attribute:

- **Type:** Number | String
- **Default:** `0`
- **Values:** Pixel values (e.g., `20`) or percentages (e.g., `'5%'`)
- **Description:** Adds space around the gallery container. Useful for creating breathing room.

#### Fixed Margin

```html
<div class="vento-image" data-margin="20">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive Margin

```html
<div class="vento-image" data-margin="5%">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use fixed pixels for consistent spacing
- Use percentages for responsive designs
- Combine with other layout options for precise control

### Glimpse

Set the glimpse (preview) size for the gallery using the `data-glimpse` attribute:

- **Type:** Number | String
- **Default:** `0`
- **Values:** Pixel values (e.g., `100`) or percentages (e.g., `'20%'`)
- **Description:** Controls the size of the glimpse (preview) area. Useful for creating a preview of the next image.

#### Fixed Glimpse

```html
<div class="vento-image" data-glimpse="100">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive Glimpse

```html
<div class="vento-image" data-glimpse="20%">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use fixed pixels for consistent glimpse size
- Use percentages for responsive designs
- Combine with other layout options for precise control

### Ratio

Maintain a specific aspect ratio for the gallery using the `data-ratio` attribute:

- **Type:** Number | String
- **Default:** Auto (determined by first image)
- **Values:** Decimal (e.g., `1.777` for 16:9) or fraction string (e.g., `'16/9'`)
- **Description:** Preserves a fixed aspect ratio regardless of container size. Essential for responsive layouts.

#### Decimal Ratio Format

Use decimal values for aspect ratio:

```html
<div class="vento-image" data-width="100%" data-ratio="1.777">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Fraction String Format

Use fraction strings for clarity:

```html
<div class="vento-image" data-width="100%" data-ratio="16/9">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Common Aspect Ratios

**16:9 (Widescreen)**

```html
<div class="vento-image" data-ratio="16/9"></div>
```

**4:3 (Standard)**

```html
<div class="vento-image" data-ratio="4/3"></div>
```

**1:1 (Square)**

```html
<div class="vento-image" data-ratio="1"></div>
```

**3:2 (Classic Photo)**

```html
<div class="vento-image" data-ratio="3/2"></div>
```

#### Responsive Gallery with Ratio

Combine width percentage with ratio for responsive galleries:

```html
<div class="vento-image" data-width="100%" data-maxwidth="1200" data-ratio="16/9">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Always use ratio with percentage width for responsive designs
- Use fraction format for readability (e.g., `'16/9'` instead of `1.777`)
- Combine with `data-maxwidth` to prevent oversizing on large screens
- Test on multiple devices to ensure proper aspect ratio maintenance

### Navigation

Control the navigation style and appearance using the `data-nav` attribute:

- **Type:** String | Boolean
- **Default:** `'dots'`
- **Values:** `'dots'`, `'thumbs'`, `false`
- **Description:** Determines the navigation style for browsing between images.

#### Navigation Styles

**Dots Navigation (Default)**
Shows clickable dots for navigation:

```html
<div class="vento-image" data-nav="dots">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**Thumbnail Navigation**
Switch from dots to thumbnails by adding `data-nav="thumbs"`:

```html
<div class="vento-image" data-nav="thumbs">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**No Navigation**
Disable navigation controls:

```html
<div class="vento-image" data-nav="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Thumbnail Options

**Optimized Thumbnails**
For better performance, use pre-scaled thumbnail images:

```html
<div class="vento-image" data-nav="thumbs">
  <a href="1.jpg"><img src="1_thumb.jpg" /></a>
  <a href="2.jpg"><img src="2_thumb.jpg" /></a>
</div>
```

**Custom Thumbnail Sizing**
Customize dimensions with `data-thumbwidth` and `data-thumbheight`:

```html
<div class="vento-image" data-nav="thumbs" data-thumbwidth="120" data-thumbheight="80">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**Variable Aspect Ratio Thumbnails**
For thumbnails with different aspect ratios, specify individual dimensions:

```html
<div class="vento-image" data-nav="thumbs">
  <a href="1.jpg"><img src="1_thumb.jpg" width="144" height="96" /></a>
  <a href="2.jpg"><img src="2_thumb.jpg" width="64" height="128" /></a>
</div>
```

#### Best Practices

- Use `'dots'` for simple galleries with few images
- Use `'thumbs'` for image-heavy galleries where preview is helpful
- Use pre-scaled thumbnails for better performance
- When using variable aspect ratios, height will be fixed (default 64px or your `data-thumbheight` value)
- Width adjusts automatically to maintain correct aspect ratio
- VentoImage can generate missing thumbnails automatically if needed

### Navigation Position

Control where the navigation controls appear using the `data-navposition` attribute:

- **Type:** String
- **Default:** `'bottom'`
- **Values:** `'bottom'`, `'top'`
- **Description:** Determines the vertical position of navigation controls (dots or thumbnails).

#### Bottom Navigation (Default)

Navigation appears at the bottom of the gallery:

```html
<div class="vento-image" data-navposition="bottom">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Top Navigation

Navigation appears at the top of the gallery:

```html
<div class="vento-image" data-navposition="top">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use `bottom` for traditional gallery layouts
- Use `top` when gallery content needs to be immediately visible
- Consider mobile layouts when choosing position
- Test on different screen sizes

### Navigation Width

Control the width of the navigation container using the `data-navwidth` attribute:

- **Type:** Number | String
- **Default:** Auto
- **Values:** Pixel values (e.g., `500`) or percentages (e.g., `'80%'`)
- **Description:** Sets the width of the navigation area. Useful for constraining navigation width.

#### Fixed Navigation Width

```html
<div class="vento-image" data-navwidth="500">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Responsive Navigation Width

```html
<div class="vento-image" data-navwidth="80%">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use fixed pixels for consistent navigation width
- Use percentages for responsive designs
- Combine with `data-nav="thumbs"` for thumbnail navigation

### Thumbnail Width

Set the width of thumbnail images using the `data-thumbwidth` attribute:

- **Type:** Number
- **Default:** `64`
- **Values:** Pixel values (e.g., `120`)
- **Description:** Controls the width of each thumbnail in pixels.

#### Custom Thumbnail Width

```html
<div class="vento-image" data-nav="thumbs" data-thumbwidth="120">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Large Thumbnails

```html
<div class="vento-image" data-nav="thumbs" data-thumbwidth="200" data-thumbheight="150">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Default 64px is good for most galleries
- Increase for image-heavy galleries
- Keep consistent with `data-thumbheight` for proper aspect ratio

### Thumbnail Height

Set the height of thumbnail images using the `data-thumbheight` attribute:

- **Type:** Number
- **Default:** `64`
- **Values:** Pixel values (e.g., `80`)
- **Description:** Controls the height of each thumbnail in pixels.

#### Custom Thumbnail Height

```html
<div class="vento-image" data-nav="thumbs" data-thumbheight="80">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Default 64px is good for most galleries
- Increase for better visibility on mobile
- Combine with `data-thumbwidth` for consistent sizing

### Thumbnail Margin

Set the spacing between thumbnails using the `data-thumbmargin` attribute:

- **Type:** Number
- **Default:** `0`
- **Values:** Pixel values (e.g., `10`)
- **Description:** Controls the margin/spacing between thumbnail images.

#### Spaced Thumbnails

```html
<div class="vento-image" data-nav="thumbs" data-thumbmargin="10">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use 5-15px for comfortable spacing
- Larger margins improve usability on touch devices
- Test on mobile for optimal spacing

### Thumbnail Border Width

Set the border width of the active thumbnail using the `data-thumbborderwidth` attribute:

- **Type:** Number
- **Default:** `0`
- **Values:** Pixel values (e.g., `3`)
- **Description:** Controls the border width of the currently active/selected thumbnail.

#### Visible Active Thumbnail

```html
<div class="vento-image" data-nav="thumbs" data-thumbborderwidth="3">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use 2-4px for clear visual feedback
- Combine with CSS for custom border color
- Improves user experience by showing current position

### Allow Fullscreen

Enable fullscreen functionality using the `data-allowfullscreen` attribute:

- **Type:** Boolean | String
- **Default:** `false`
- **Values:** `false`, `true`, `'native'`
- **Description:** When enabled, adds a fullscreen toggle icon and allows users to view images in fullscreen mode.

#### Basic Fullscreen

Enable fullscreen functionality with a toggle icon:

```html
<div class="vento-image" data-allowfullscreen="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

This adds a fullscreen toggle icon in the top-right corner of the gallery.

#### Native Fullscreen Support

For modern browsers, use native browser fullscreen API for better performance:

```html
<div class="vento-image" data-allowfullscreen="native">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### High-Resolution Image Support

Specify separate fullscreen versions of your images using the `data-full` attribute:

```html
<div class="vento-image" data-allowfullscreen="native">
  <img src="1.jpg" data-full="1_full.jpg" />
  <img src="2.jpg" data-full="2_full.jpg" />
</div>
```

#### CDN Integration

When using image CDNs like Uploadcare, you can serve different image sizes from the same source:

- **Original (large) image:**
  ```
  https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/
  ```
- **Resized (smaller) version** (640px wide):
  ```
  https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/-/resize/640x/
  ```

This approach allows you to maintain high-quality images for fullscreen mode while serving optimized versions for regular viewing.

#### Best Practices

- Use `true` for basic fullscreen functionality with fallback support
- Use `native` for modern browsers to leverage native fullscreen API
- Provide high-resolution images with `data-full` for better fullscreen experience
- Consider CDN integration for optimal performance across different screen sizes

### Fit

Control how images are scaled and positioned within the gallery container using the `data-fit` attribute:

- **Type:** String
- **Default:** `'contain'`
- **Values:** `'contain'`, `'cover'`, `'scaledown'`, `'none'`
- **Description:** Determines how images are scaled to fit within the gallery dimensions.

#### Available Fit Modes

**1. `contain` (Default)**
Stretches the image to be fully displayed while fitting within the VentoImage container, maintaining the original aspect ratio.

**2. `cover`**
Stretches and crops the image to completely cover the VentoImage container while maintaining aspect ratio.

**3. `scaledown`**
Only stretches the image if it's larger than the VentoImage container, otherwise displays at original size.

**4. `none`**
Uses the image's own dimensions without any scaling or cropping.

#### Usage Examples

**Global Setting**
Set the default fit mode for all images in the gallery:

```html
<div class="vento-image" data-fit="cover">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**Per-Image Override**
Override the global setting for individual images:

```html
<div class="vento-image" data-fit="cover">
  <img src="1.jpg" />
  <img src="2.jpg" data-fit="contain" />
  <img src="3.jpg" data-fit="none" />
</div>
```

#### Use Case Examples

**Cover Fit (Good for full-bleed images)**

```html
<div class="vento-image" data-fit="cover">
  <img src="landscape.jpg" />
  <img src="portrait.jpg" />
</div>
```

**Mixed Fit Modes**

```html
<div class="vento-image" data-fit="contain">
  <img src="1.jpg" />
  <img src="2.jpg" data-fit="cover" />
  <img src="3.jpg" data-fit="none" />
</div>
```

#### Best Practices

- Use `cover` for full-bleed background-style images
- Use `contain` for product galleries where the entire product must be visible
- Use `scaledown` for mixed content where some images may be smaller than the gallery
- Use `none` for pixel-perfect display of UI elements or when you need exact image dimensions

### Thumbnail Fit

_TBD: Detailed documentation for thumbnail fit option_

### Transition

Control how images transition between frames using the `data-transition` attribute:

- **Type:** String
- **Default:** `'slide'`
- **Values:** `'slide'`, `'crossfade'`, `'dissolve'`
- **Description:** Determines the visual effect when transitioning between images.

#### Available Transition Effects

**1. `slide` (Default)**
Slides images horizontally, creating a natural carousel-like navigation.

**2. `crossfade`**
Gradually fades between images, creating a smooth, elegant transition.

**3. `dissolve`**
A variation of fade that works particularly well with images containing similar elements or identical fragments.

#### Usage Examples

**Basic Transition**
Set the transition effect for your gallery:

```html
<div class="vento-image" data-transition="crossfade">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**Dissolve Transition**
The `dissolve` effect is particularly effective when transitioning between similar images:

```html
<div class="vento-image" data-transition="dissolve">
  <img src="before.jpg" />
  <img src="after.jpg" />
</div>
```

**Mixed Transitions**
Use different transitions for different interactions. For example, slide on swipe but crossfade on click:

```html
<div class="vento-image" data-transition="slide" data-clicktransition="crossfade">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Use Case Examples

**Basic Crossfade**

```html
<div class="vento-image" data-transition="crossfade">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

**Mixed Interaction Transitions**

```html
<div class="vento-image" data-transition="slide" data-clicktransition="crossfade">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `slide` for a traditional gallery/carousel experience
- Choose `crossfade` for a more subtle, elegant transition
- The `dissolve` effect works best with images that share similar compositions
- Consider using mixed transitions to provide visual feedback for different interaction types
- Test transitions on various devices to ensure smooth performance

### Click Transition

Set an alternative transition effect for click interactions using the `data-clicktransition` attribute:

- **Type:** String
- **Default:** Same as `data-transition`
- **Values:** `'slide'`, `'crossfade'`, `'dissolve'`
- **Description:** Allows different transition effects for clicks vs. other interactions (swipe, arrows).

#### Different Transition for Clicks

Use slide for swipe but crossfade for clicks:

```html
<div class="vento-image" data-transition="slide" data-clicktransition="crossfade">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use different transitions to provide visual feedback for different interaction types
- Crossfade works well for click interactions (more deliberate)
- Slide works well for swipe interactions (more natural)
- Test on different devices to ensure smooth performance

### Captions

Add descriptive text overlays to your images using the `data-caption` attribute:

- **Type:** Boolean | String
- **Default:** `true`
- **Values:** `true`, `false`, or custom caption text
- **Description:** When enabled, displays captions for images. Can be controlled globally or per-image.

#### Basic Captions

Add captions to your gallery items using the `data-caption` attribute:

```html
<div class="vento-image">
  <img src="1.jpg" data-caption="Beautiful Landscape" />
  <img src="2.jpg" data-caption="City Skyline at Night" />
</div>
```

#### HTML in Captions

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

#### Caption Positioning

Control where captions appear using the `data-caption-position` attribute:

```html
<div class="vento-image" data-caption-position="bottom">
  <img src="1.jpg" data-caption="Bottom Caption" />
  <img src="2.jpg" data-caption-position="top" data-caption="Top Caption" />
  <img src="3.jpg" data-caption-position="middle" data-caption="Middle Caption" />
</div>
```

**Position Options:**

- `bottom` (Default) - Caption appears at the bottom of the image
- `top` - Caption appears at the top of the image
- `middle` - Caption appears centered in the middle of the image

#### Styling Captions

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

#### Caption Animation

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

#### Advanced: Dynamic Captions

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

#### Best Practices

- Keep captions concise and to the point
- Use HTML sparingly for better performance
- Ensure good contrast between text and background
- Test captions on different screen sizes
- Consider accessibility when using colored text or complex layouts
- Use semantic HTML tags in captions for better readability

### Hash Navigation

Enable URL hash updates when navigating through the gallery using `data-hash="true"`:

```html
<div class="vento-image" data-hash="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" id="three" />
</div>
```

- **Type:** Boolean | String
- **Default:** `false`
- **Description:** When enabled, updates the URL hash when navigating between images, allowing direct linking to specific images.

### How It Works

- Updates the URL with a hash when navigating between images
- Supports both frame numbers (e.g., `#1`, `#2`) and element IDs (e.g., `#three`)
- Enables sharing direct links to specific images in the gallery

### Deep Linking

Link directly to specific images using:

- Position: `yourpage.html#1` (first image), `yourpage.html#2` (second image), etc.
- Element ID: `yourpage.html#three` (image with `id="three"`)

### Custom Hash Prefix

Add a custom prefix to avoid hash conflicts:

```html
<div class="vento-image" data-hash="gallery-">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

This will produce hashes like `#gallery-1`, `#gallery-2`, etc.

### Best Practices

1. Use unique IDs for individual image targeting
2. Keep hash prefixes short but descriptive
3. Test deep linking across different pages
4. Consider SEO implications if using hash-based navigation for content

### JavaScript API

Access and control hash navigation programmatically:

````javascript
// Get current hash
const currentHash = document.querySelector('.vento-image').getAttribute('data-hash');

// Listen for hash changes
window.addEventListener('hashchange', function() {
    console.log('Hash changed to:', window.location.hash);
});

### Start Index

Set which image displays first when the gallery loads using the `data-startindex` attribute:

- **Type:** Number | String
- **Default:** `0`
- **Values:** Image index (0-based) or element ID
- **Description:** Determines the initial image displayed when the gallery loads.

#### Start with Specific Index

```html
<div class="vento-image" data-startindex="2">
  <img src="1.jpg">
  <img src="2.jpg">
  <img src="3.jpg">
</div>
````

#### Start with Element ID

```html
<div class="vento-image" data-startindex="featured">
  <img src="1.jpg" />
  <img src="2.jpg" id="featured" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use 0-based indexing for numeric values
- Use element IDs for more readable code
- Useful for highlighting featured images

### Loop

Enable seamless looping between the last and first frame by setting `data-loop="true"`:

```html
<div class="vento-image" data-loop="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

- **Type:** Boolean
- **Default:** `false`
- **Description:** When enabled, creates an infinite loop by seamlessly transitioning from the last image back to the first one and vice versa.

### Autoplay

Enable automatic slideshow playback using `data-autoplay="true"`:

```html
<div class="vento-image" data-autoplay="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

- **Type:** Boolean | Number (milliseconds)
- **Default:** `false`
- **Description:** When enabled, automatically advances to the next image after a specified interval. The default interval is 5000ms (5 seconds). You can specify a custom interval in milliseconds, for example, `data-autoplay="3000"` for 3 seconds between slides.

### Stop Autoplay on Touch

Control whether autoplay stops when users interact with the gallery using `data-stopautoplayontouch`:

- **Type:** Boolean
- **Default:** `false`
- **Values:** `true`, `false`
- **Description:** When enabled, stops autoplay slideshow when user touches or interacts with the gallery.

#### Stop Autoplay on Touch

```html
<div class="vento-image" data-autoplay="true" data-stopautoplayontouch="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `true` for better user experience when autoplay is enabled
- Prevents autoplay from interfering with user interactions
- Good for accessibility and user control preferences

### Keyboard Navigation

Enable keyboard navigation with arrow keys by setting `data-keyboard="true"`:

```html
<div class="vento-image" data-keyboard="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

### Advanced Keyboard Controls

For more control over keyboard navigation, you can specify which keys to enable by passing an object to `data-keyboard`:

```html
<div
  class="vento-image"
  data-keyboard='{"space": true, "home": true, "end": true, "up": true, "down": true}'
>
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

- **Type:** Boolean | Object
- **Default:** `false`
- **Options:**
  - `left` (Boolean): Enable left arrow key (default: `true` when keyboard is enabled)
  - `right` (Boolean): Enable right arrow key (default: `true` when keyboard is enabled)
  - `space` (Boolean): Enable space key (default: `false`)
  - `home` (Boolean): Enable home key (default: `false`)
  - `end` (Boolean): Enable end key (default: `false`)
  - `up` (Boolean): Enable up arrow key (default: `false`)
  - `down` (Boolean): Enable down arrow key (default: `false`)
- **Description:** When enabled, allows users to navigate the gallery using keyboard controls.

### Arrows

Control the display of navigation arrows using the `data-arrows` attribute:

- **Type:** Boolean | String
- **Default:** `true`
- **Values:** `true`, `false`, `'always'`
- **Description:** Controls when navigation arrows are shown for moving between frames.

#### Basic Arrows

```html
<div class="vento-image" data-arrows="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Always Show Arrows

```html
<div class="vento-image" data-arrows="always">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Hide Arrows

```html
<div class="vento-image" data-arrows="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `true` for default hover behavior
- Use `'always'` for always visible arrows
- Use `false` when using other navigation methods (dots, thumbs)

### Click

Enable or disable frame navigation by clicking using the `data-click` attribute:

- **Type:** Boolean
- **Default:** `true`
- **Values:** `true`, `false`
- **Description:** When enabled, allows users to navigate between frames by clicking on the gallery.

#### Enable Click Navigation

```html
<div class="vento-image" data-click="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Disable Click Navigation

```html
<div class="vento-image" data-click="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `false` when you want to prevent accidental navigation
- Good for galleries where images should only be viewed, not navigated
- Combine with arrows or keyboard navigation for intentional control

### Swipe

Enable or disable swipe gestures for touch devices using the `data-swipe` attribute:

- **Type:** Boolean
- **Default:** `true`
- **Values:** `true`, `false`
- **Description:** When enabled, allows users to navigate between frames by swiping on touch devices.

#### Enable Swipe Gestures

```html
<div class="vento-image" data-swipe="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Disable Swipe Gestures

```html
<div class="vento-image" data-swipe="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Keep `true` for mobile-friendly galleries
- Use `false` for desktop-only galleries
- Test swipe sensitivity on different devices

### Trackpad

Enable trackpad and mouse wheel navigation using the `data-trackpad` attribute:

- **Type:** Boolean
- **Default:** `false`
- **Values:** `true`, `false`
- **Description:** When enabled, allows users to navigate between frames using trackpad scrolling or mouse wheel.

#### Enable Trackpad Navigation

```html
<div class="vento-image" data-trackpad="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Disable Trackpad Navigation

```html
<div class="vento-image" data-trackpad="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `true` for desktop galleries where trackpad navigation enhances UX
- Use `false` for mobile-focused galleries
- Test scroll sensitivity to avoid accidental navigation

### Shuffle

Randomize the order of frames on gallery load using the `data-shuffle` attribute:

- **Type:** Boolean
- **Default:** `false`
- **Values:** `true`, `false`
- **Description:** When enabled, randomly shuffles the order of images when the gallery loads.

#### Enable Shuffle

```html
<div class="vento-image" data-shuffle="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Disable Shuffle

```html
<div class="vento-image" data-shuffle="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Best Practices

- Use `true` for galleries where random viewing order is desired
- Use `false` for galleries with specific narrative or chronological order
- Consider using with `startindex` to highlight specific images

### Thumbnail Fit

Control how thumbnails are scaled within their containers using the `data-thumbfit` attribute:

- **Type:** String
- **Default:** `'cover'`
- **Values:** `'contain'`, `'cover'`, `'scaledown'`, `'none'`
- **Description:** Determines how thumbnail images are scaled to fit within the thumbnail container.

#### Available Fit Modes

**1. `cover` (Default)**
Stretches and crops the thumbnail to completely cover the thumbnail container while maintaining aspect ratio.

**2. `contain`**
Stretches the thumbnail to be fully displayed while fitting within the thumbnail container, maintaining the original aspect ratio.

**3. `scaledown`**
Only stretches the thumbnail if it's larger than the thumbnail container, otherwise displays at original size.

**4. `none`**
Uses the thumbnail's own dimensions without any scaling or cropping.

#### Usage Examples

**Cover Fit (Default)**

```html
<div class="vento-image" data-thumbfit="cover">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

**Contain Fit**

```html
<div class="vento-image" data-thumbfit="contain">
  <img src="1.jpg" />
  <img src="2.jpg" />
</div>
```

#### Best Practices

- Use `cover` for consistent thumbnail appearance
- Use `contain` when you need to see entire thumbnails
- Test different fit modes with your thumbnail sizes

### Shadows

Enable or disable visual shadows around the gallery using the `data-shadows` attribute:

- **Type:** Boolean
- **Default:** `true`
- **Values:** `true`, `false`
- **Description:** When enabled, adds subtle shadows around the gallery container for visual depth.

#### Enable Shadows

```html
<div class="vento-image" data-shadows="true">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Disable Shadows

```html
<div class="vento-image" data-shadows="false">
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
</div>
```

#### Custom Shadow Styling

You can customize shadows with CSS:

```css
.vento-image {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.vento-image--no-shadows {
  box-shadow: none;
}
```

#### Best Practices

- Use `true` for galleries that need visual depth
- Use `false` for clean, minimal designs
- Consider your overall design aesthetic when deciding

### Right-to-Left (RTL) Support

Support for right-to-left languages like Hebrew or Arabic with `data-direction="rtl"`:

```html
<div class="vento-image" data-direction="rtl">
  <img src="1.jpg" data-caption="1. الرجل في سيارة" />
  <img src="2.jpg" data-caption="2. جوقة" />
</div>
```

- **Type:** String
- **Values:** `'ltr'` (default) or `'rtl'`
- **Effects when set to 'rtl':**
  - **Frame Order:** Reverses the display order of frames
  - **Captions:** Adjusts positioning and alignment for RTL text
  - **Autoplay:** Reverses the slideshow direction
  - **Navigation:** Mirrors the position of navigation controls
  - **Text Alignment:** Automatically adjusts text alignment for RTL languages

## Defaults

Override defaults by defining `ventoImageDefaults` before loading VentoImage:

```html
<script>
  ventoImageDefaults = {
    width: 700,
    maxwidth: '100%',
    ratio: 16 / 9,
    allowfullscreen: true,
    nav: 'thumbs',
  };
</script>
<script src="path/to/vento-image.js"></script>
```
