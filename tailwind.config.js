/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary & Neutral Palette
        primary: '#2B7FFF',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'border-subtle': '#E5E7EB',
        'surface-background': '#F9FAFB',
        'surface-card': '#FFFFFF',

        // Semantic Palette
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',

        // Energy & Mood Rating Scale
        'energy-very-negative': '#EF4444',
        'energy-negative': '#F97316',
        'energy-neutral': '#6B7280',
        'energy-positive': '#22C55E',
        'energy-very-positive': '#10B981',

        // Task Priority Colors
        'priority-high': '#EF4444',
        'priority-medium': '#F59E0B',
        'priority-low': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['30px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-2': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-3': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-large': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'base': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      maxWidth: {
        'content': '1280px',
      },
      borderRadius: {
        'btn': '8px',
        'card': '12px',
        'input': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      screens: {
        'mobile': '0px',
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 