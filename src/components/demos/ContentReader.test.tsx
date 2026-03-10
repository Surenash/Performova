import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContentReader from './ContentReader'

// Mocking the Lucide icons to avoid potential issues during rendering in the test environment
// Use descriptive names to distinguish them from the dots
vi.mock('lucide-react', async () => {
    return {
        BookOpen: () => <div data-testid="book-open-icon" aria-label="BookOpen" />,
        ChevronLeft: () => <div data-testid="chevron-left-icon" aria-label="Previous" />,
        ChevronRight: () => <div data-testid="chevron-right-icon" aria-label="Next" />,
        Minus: () => <div data-testid="minus-icon" aria-label="Minus" />,
        Plus: () => <div data-testid="plus-icon" aria-label="Plus" />,
        Clock: () => <div data-testid="clock-icon" aria-label="Clock" />,
    }
})

describe('ContentReader Component', () => {
    it('renders the first page by default', () => {
        render(<ContentReader />)
        expect(screen.getByText('What is Social Engineering?')).toBeInTheDocument()
        expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument()
    })

    it('navigates to the next page when clicking the Next button', () => {
        render(<ContentReader />)
        const nextButton = screen.getByRole('button', { name: /next/i })

        fireEvent.click(nextButton)

        expect(screen.getByText('Common Attack Vectors')).toBeInTheDocument()
        expect(screen.getByText(/Page 2 of 3/i)).toBeInTheDocument()
    })

    it('navigates to the previous page when clicking the Previous button', () => {
        render(<ContentReader />)
        const nextButton = screen.getByRole('button', { name: /next/i })
        fireEvent.click(nextButton) // Go to page 2

        const prevButton = screen.getByRole('button', { name: /previous/i })
        fireEvent.click(prevButton) // Back to page 1

        expect(screen.getByText('What is Social Engineering?')).toBeInTheDocument()
        expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument()
    })

    it('disables the Previous button on the first page', () => {
        render(<ContentReader />)
        const prevButton = screen.getByRole('button', { name: /previous/i })
        expect(prevButton).toBeDisabled()
    })

    it('disables the Next button on the last page', () => {
        render(<ContentReader />)
        const nextButton = screen.getByRole('button', { name: /next/i })

        // Go to the last page (page 3)
        fireEvent.click(nextButton)
        fireEvent.click(nextButton)

        expect(nextButton).toBeDisabled()
        expect(screen.getByText('How to Protect Yourself')).toBeInTheDocument()
    })

    it('navigates to a specific page when clicking on page dots', () => {
        render(<ContentReader />)

        // The page dots are the buttons that don't have text content and don't contain icons with labels
        const buttons = screen.getAllByRole('button')
        const dots = buttons.filter(button => {
            const hasText = button.textContent && button.textContent.trim().length > 0;
            const hasIconWithLabel = button.querySelector('[aria-label]');
            return !hasText && !hasIconWithLabel;
        });

        expect(dots.length).toBe(3); // Verify we found the correct number of dots

        // Let's click on the third dot (index 2)
        fireEvent.click(dots[2])

        expect(screen.getByText('How to Protect Yourself')).toBeInTheDocument()
        expect(screen.getByText(/Page 3 of 3/i)).toBeInTheDocument()
    })

    it('adjusts font size using plus and minus buttons', () => {
        render(<ContentReader />)

        const initialFontSize = screen.getByText('15')
        expect(initialFontSize).toBeInTheDocument()

        // Find buttons by their aria-labels defined in the mock
        const plusButton = screen.getByRole('button', { name: 'Plus' })
        const minusButton = screen.getByRole('button', { name: 'Minus' })

        fireEvent.click(plusButton)
        expect(screen.getByText('16')).toBeInTheDocument()

        fireEvent.click(minusButton)
        fireEvent.click(minusButton)
        expect(screen.getByText('14')).toBeInTheDocument()
    })
})
