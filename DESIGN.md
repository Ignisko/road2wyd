# Design System & Anti-Slop Principles (DESIGN.md)

Adopted from the Impeccable design vocabulary to ensure visual quality, restraint, and deliberate hierarchy. Every modification to CSS, HTML, layouts, or copy must adhere strictly to these rules.

---

## 1. Typography & Contrast
* **No Default Fonts by Reflex**: Do not use generic system sans-serifs or default fonts (like Inter) without deliberate intent. 
* **Real Contrast**: Create a sharp type scale with distinct size, weight, and style contrasts (e.g., pairing a bold geometric/grotesque sans-serif with a graceful editorial serif).
* **Hierarchy**: Hierarchy must be immediate and visible. Headings should feel heavy and grounded; body text must be highly readable with optimal line heights (`1.5` to `1.7`).

## 2. Color, Contrast & Accessibility
* **Commit to a Hue**: Avoid generic, muddy, or randomized colors. Build cohesive, curated palettes that clear WCAG contrast requirements.
* **No AI Gradient Defaults**: Never default to purple-to-blue gradients, glassmorphism, or generic glowing shadows unless specifically requested.
* **Functional Color**: Use accent colors strategically to guide the eye toward functional elements (links, active pins, navigation), not for arbitrary decoration.

## 3. Spatial Design & Layout
* **Visual Rhythm**: Define layout structure using negative space, vertical rhythm, and asymmetrical margins.
* **No Cards-in-Cards Slop**: Avoid nesting identical cards in more cards. Simplify nested structures into flat grids or clean list elements.
* **Generous Spacing**: Give interactive elements breathing room (e.g., using `120vh` or larger offsets to separate stages of scrollable narrative timelines).

## 4. Responsive Layouts
* **Mobile-First**: Design layouts starting from standard small screen viewports (smartphones) first, then scale outwards.
* **Fluid Breakpoints**: Breakpoints must follow the naturally breaking limits of the content, not arbitrary device standard widths.

## 5. Interaction & Affordances
* **Honest States**: Use clean transitions, hover transforms, and focus outlines.
* **No Default Gimmicks**: Avoid using modals, overlays, or gradient texts for simple actions. Keep states predictable and functional.

## 6. Motion & Physics
* **Physics-Based Easing**: Animations must ease in and out like real physical objects (e.g., cubic-bezier transitions). 
* **No Spring Overshoots**: Transitions should settle firmly. Nothing should bounce, overshoot, or spring past its mark unless explicitly styled for high-cinematic playfulness.

## 7. UX Writing & Copy
* **Calm & Clinical Voice**: Use precise, clear, and descriptive text. Focus on what the interface does.
* **Zero AI Copy-Paste Slop**: Eliminate boilerplate headers like *"Welcome to our platform"* or *"Boost your productivity"*. State the exact value or function directly.
