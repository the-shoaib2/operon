'use client'

import { Button } from '@repo/ui'

export function CloseButton() {
    return (
        <Button
            onClick={() => window.close()}
            variant="secondary"
            size="lg"
            className="w-full"
        >
            Cancel
        </Button>
    )
}
