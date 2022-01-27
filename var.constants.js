export const reservedHomeRam = 10;
export const loop_time = 20000;

const HackSemaphores = {
    AVAILABLE: Symbol("Available"),
    BOOTSTRAPPED: Symbol("Bootstrapped"),
    IN_PROGRESS: Symbol("In Progress"),
    HOLD: Symbol("Hold"),
    CANCELLED: Symbol("Cancelled"),
    COMPLETED: Symbol("Completed"),
    ILLEGAL: Symbol("Illegal"),
    DISQUALIFIED: Symbol("Disqualified"),
    SATURATED: Symbol("Saturated"),
    RESERVED: Symbol("Reserved"),
};

export const strategy_semaphores = HackSemaphores;
