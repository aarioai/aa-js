import {SyntheticEvent} from './define'

export function preventEvent(event: SyntheticEvent) {
    if (!event) {
        return
    }

    // Stop event bubbling/propagation to parent elements
    event.stopPropagation?.()

    // Stop immediate propagation in React's event system
    event.nativeEvent?.stopImmediatePropagation?.()
    
    // Prevent default browser behavior for the event
    // e.g.: Prevents <a> tags from navigating, onclick and jQuery onClick events
    // Note: For touch events, this will prevent subsequent onTouchEnd/onClick events
    event.preventDefault?.()
}