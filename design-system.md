# Energy Flow - Design System

## 1. Design Philosophy

Our design is centered around the concept of **"Clarity and Flow."** We aim to create an intuitive and calming experience that helps users understand their personal energy without friction. The interface should feel modern, responsive, and trustworthy, enabling users to focus on their tasks and reflections.

### 1.1 Core Principles
1.  **Clarity First**: Eliminate ambiguity. Every element must have a clear purpose.
2.  **Efficiency by Design**: User flows should be streamlined for minimal clicks and cognitive load.
3.  **Responsive & Accessible**: The experience must be seamless across all devices and accessible to everyone.
4.  **Data-Informed Aesthetics**: Visualizations should be beautiful, insightful, and easy to interpret.

## 2. Color System

Our color palette is designed to be clean and functional, with specific colors assigned to convey meaning for states, actions, and data.

### 2.1 Primary & Neutral Palette
-   **Primary/Brand**: `#2B7FFF` (Bright Blue) - Used for primary actions, active states, and focus indicators.
-   **Text/Primary**: `#1F2937` (Gray-900) - For main headlines and body text.
-   **Text/Secondary**: `#6B7280` (Gray-500) - For subheadings, descriptions, and helper text.
-   **Border/Subtle**: `#E5E7EB` (Gray-200) - For dividers and standard input borders.
-   **Surface/Background**: `#F9FAFB` (Gray-50) - For the main application background.
-   **Surface/Card**: `#FFFFFF` (White) - For all card-based elements.

### 2.2 Semantic Palette
-   **Success**: `#10B981` (Green) - For confirmation messages and positive stats.
-   **Warning**: `#F59E0B` (Amber) - For non-critical alerts and pending states.
-   **Danger**: `#EF4444` (Red) - For errors, destructive actions, and negative stats.
-   **Info**: `#3B82F6` (Blue) - For informational tooltips and callouts.

### 2.3 Energy & Mood Rating Scale (Gradient)
-   **-5 (Very Negative)**: `#EF4444` (Red)
-   **-3**: `#F97316` (Orange)
-   **0 (Neutral)**: `#6B7280` (Gray)
-   **+3**: `#22C55E` (Green)
-   **+5 (Very Positive)**: `#10B981` (Emerald)

### 2.4 Task Priority Colors
-   **High**: `#EF4444` (Red)
-   **Medium**: `#F59E0B` (Amber)
-   **Low**: `#6B7280` (Gray)

## 3. Typography

-   **Font Family**: `Inter`, sans-serif. A clean, modern, and highly readable font for UIs.
-   **Font Scale (px)**:
    -   `Heading 1`: 30 (Bold)
    -   `Heading 2`: 24 (Bold)
    -   `Heading 3`: 20 (Semibold)
    -   `Body/Large`: 16 (Regular)
    -   `Body/Default`: 14 (Regular)
    -   `Caption`: 12 (Regular)

## 4. Layout & Spacing

-   **Grid System**: 12-column flexible grid.
-   **Base Unit**: `4px`. All spacing and sizing are multiples of the base unit (e.g., 8px, 12px, 16px).
-   **Page Padding**: `24px` on Desktop, `16px` on Mobile.
-   **Max Content Width**: `1280px` for wide-screen layouts.

## 5. Core Components

### 5.1 Button
-   **States**:
    -   `Default`: Standard appearance.
    -   `Hover`: Subtle background/color change to indicate interactivity.
    -   `Focus`: Visible ring (`Primary` color with opacity) for accessibility.
    -   `Active`: Darker background/color change on click.
    -   `Disabled`: Opacity `50%`, `not-allowed` cursor.
-   **Variants**:
    -   `Primary`: Solid `Primary` color background. For main CTAs.
    -   `Secondary`: White background with a subtle `Border` color. For secondary actions.
    -   `Destructive`: `Danger` color background. For actions like deleting.
    -   `Ghost`: Transparent background, text only. For low-emphasis actions.
-   **Sizing**: `sm` (32px), `md` (40px), `lg` (48px).

### 5.2 Card
-   **Base Style**: `12px` border-radius, `Surface/Card` background, subtle shadow (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`).
-   **Task Card**: Includes a left border indicating priority (`4px` width, using `Task Priority Colors`).
-   **Interactive Card**: On `Hover`, the shadow becomes slightly more prominent and the card lifts.

### 5.3 Form Controls (Input, Select, Textarea)
-   **Base Style**: `8px` border-radius, `Surface/Card` background, `Border/Subtle` color for the border.
-   **States**:
    -   `Focus`: Border color changes to `Primary`. A subtle outer glow may be added.
    -   `Error`: Border color changes to `Danger`. An error icon appears inside the input.
    -   `Disabled`: Background color changes to `Surface/Background`, text is grayed out.

### 5.4 Tag / Badge
-   **Style**: Pill-shaped, small font (`Caption` size), `2px` top/bottom padding, `8px` left/right padding.
-   **Usage**: Used for task status and categories, using semantic colors for clarity (e.g., `Success` green for 'Completed').

### 5.5 Slider
-   **Track**: `4px` height, `Border/Subtle` color.
-   **Thumb**: `16px` diameter circle, `Primary` color, with a subtle shadow.
-   **Interaction**: Thumb grows slightly larger on `Hover` and `Active`.

### 5.6 Tabs
-   **Style**: Can be a line under the active tab or a pill-shaped background.
-   **Active State**: Text color changes to `Primary`, font becomes `Semibold`. The line or pill is colored `Primary`.
-   **Hover State**: Background color of the tab item changes to a subtle gray.

## 6. Data Visualization

### 6.1 Charts (Line, Bar)
-   **Color Palette**: Use `Primary`, `Secondary`, and `Semantic` colors for data series.
-   **Grid Lines**: Dashed, very subtle `Border/Subtle` color.
-   **Axis Labels**: `Caption` size, `Text/Secondary` color.
-   **Interaction**:
    -   **Tooltip**: On hover, a tooltip appears in a `Card` style, showing the precise data point values. The corresponding line/bar should be highlighted.
    -   **No Over-complication**: Avoid complex animations. Focus on clarity and readability.

## 7. Responsiveness

-   **Breakpoints**:
    -   `Mobile`: `< 768px`
    -   `Tablet`: `768px - 1024px`
    -   `Desktop`: `> 1024px`
-   **Layout Shifts**:
    -   **Navigation**: Top tabs on Desktop may transform into a hamburger menu or bottom tabs on Mobile.
    -   **Multi-Column Layouts**: Dashboards and boards with 2-3 columns on Desktop will stack into a single-column view on Mobile.
    -   **Typography & Spacing**: Font sizes and padding will be scaled down slightly on smaller screens to maintain balance.

## 8. Icons

-   **Style**: `Feather Icons` or a similar clean, line-based library. `1.5px` stroke width.
-   **Common Icons**: `plus` (add), `check` (complete), `clock` (time), `edit-3` (edit), `trash` (delete), `bar-chart-2` (analytics), `sliders` (settings).

## 9. Accessibility
- **Color Contrast**: Ensure all text meets WCAG AA standards.
- **Focus States**: All interactive elements must have a clear and visible focus state.
- **ARIA Roles**: Use appropriate ARIA attributes for complex components like tabs and modals. 